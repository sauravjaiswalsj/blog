```markdown
# CS402 – Fundamental Ideas: Representing Numbers

## 1. Continuous maths on discrete machines
- Real numbers \( \mathbb{R} \) have infinitely many digits; computers must truncate to fit a finite number of bits.[page:12]  
- Using arbitrarily many bits per number would explode memory usage and slow hardware, so machines approximate reals with fixed-size formats.[page:12]  
- Many values (like \(1/3\), \( \pi \)) are “unstorable”; only approximations can be represented.[page:12]

## 2. Fixed-point representation
- Fixed-point stores a fixed number of digits before and after the binary (or decimal) point, e.g. \(3.625_{10} = 11.101_2\).[page:12]  
- It works for limited ranges (e.g. 8-bit fraction from \(0\) to \(15.9375\)), but large or tiny physical values (sun mass vs electron mass) would need hundreds of bits, mostly zeros.[page:12]  
- Fixed-point is used in some areas (e.g. finance) but is unsuitable for wide-range scientific computing.[page:12]

## 3. Error, accuracy, precision
- With finite bits, representing a real \(x\) by machine value \(x_m\) introduces error: absolute error \(e = |x_m - x|\), relative error \(\epsilon = e/|x|\).[page:12]  
- **Precision**: how many significant digits a representation can carry; **accuracy**: how close a value is to the true one.[page:12]  
- A low-precision value can be more accurate than a high-precision one if the latter has early digit errors; algorithms should preserve as much accuracy as precision allows.[page:12]

## 4. Floating-point representation (concept)
- Floating point lets the binary point “float”: \(x = \text{mantissa} \times 2^{\text{exponent}}\), enabling a much larger range than fixed-point for the same bits.[page:12]  
- Both mantissa and exponent are stored in fixed-size fields; normalisation keeps mantissa in a standard range (e.g. \(0.1\ldots\) or \(1.\ldots\) in IEEE form).[page:12]  
- Example: an 8-bit toy FP with 5 mantissa + 3 exponent bits shows how normalisation and truncation give a significantly larger representable range than fixed-point.[page:12]

## 5. Truncation vs rounding
- Truncation simply chops off extra bits, always biasing the result downwards and creating a systematic (biased) error.[page:12]  
- Rounding compares discarded bits against half of the least significant kept bit; if greater, increment the last kept bit, giving an unbiased error at the cost of an extra operation.[page:12]  
- Rounding is preferred in numerical work because it keeps errors statistically centred around zero.[page:12]

## 6. IEEE 754 floating-point basics
- Normalised IEEE FP numbers have the form \(\pm 1.\text{mantissa} \times 2^{\text{exponent}}\).[page:12]  
- Bit layouts:  
  - Single (FP32): 1 sign, 8 exponent, 23 mantissa bits.  
  - Double (FP64): 1 sign, 11 exponent, 52 mantissa bits.  
  - Extended, Quad have more exponent and mantissa bits.[page:12]  
- Exponent is stored with a **bias**: exponent + 127 (single) or +1023 (double), enabling representation of negative exponents without an extra sign bit.[page:12]

## 7. IEEE 754 special values
- Exponent all 1s + non-zero mantissa ⇒ NaN (“not a number”), used for undefined operations like \(0/0\); NaNs propagate through arithmetic.[page:12]  
- Exponent all 1s + zero mantissa ⇒ \(+\infty\) or \(-\infty\); exponent all 0s + zero mantissa ⇒ signed zeros \(+0\), \(-0\).[page:12]  
- Exponent all 0s + non-zero mantissa ⇒ **denormalized/subnormal** numbers, allowing gradual underflow but being slower and numerically fragile (values near precision limit).[page:12]

## 8. Distribution of FP numbers
- FP values are of the form \(\text{mantissa} \times 2^{\text{exponent}}\) with fixed mantissa bits.[page:12]  
- As exponent increases, spacing between adjacent representable numbers grows; each power-of-two interval has the same count of FP numbers spread over a larger range.[page:12]  
- Floating-point has nearly constant **relative** precision, not constant absolute precision.[page:12]

## 9. Machine precision (machine epsilon)
- Machine precision \(\epsilon\) is the smallest relative spacing between adjacent representable FP numbers, often measured around 1.0.[page:12]  
- Programmatically, decrease a candidate \(\epsilon\) until \(1.0 + \epsilon == 1.0\) in FP arithmetic; the last value that changed the sum is the machine epsilon.[page:12]  
- For IEEE FP32, \(\epsilon = 2^{-23} \approx 10^{-7}\); for IEEE FP64, \(\epsilon = 2^{-52} \approx 10^{-16}\).[page:12]

## 10. Rounding error and representation of 0.1
- Many decimals, e.g. \(0.1_{10}\), have infinite binary expansions; FP must round them to the nearest representable number.[page:12]  
- For 0.1 in double precision, the relative error is about \(5.55 \times 10^{-17}\), bounded by \(\epsilon/2\), showing that rounding a single number introduces at most half an ulp of error.[page:12]  
- Relative rounding error for normalised numbers is always \(\le \epsilon/2\).[page:12]

## 11. FP operations and accumulated error
- After each FP operation, the result is rounded, so every computed value is of the form \(x_M = x(1 + \delta)\) with \(|\delta| \le \epsilon\).[page:12]  
- Basic operations can be modelled as  
  - \(x \oplus y = (x + y)(1 + \epsilon)\),  
  - \(x \ominus y = (x - y)(1 + \epsilon)\),  
  - \(x \otimes y = (x \times y)(1 + \epsilon)\),  
  - \(x \oslash y = (x / y)(1 + \epsilon)\),  
  where \(\epsilon\) abstracts worst-case rounding.[page:12]  
- During analysis, higher-order terms like \(\epsilon^2\) are neglected, and combined errors are approximated linearly (e.g. \(\epsilon + \epsilon \approx 2\epsilon\)).[page:12]

## 12. Non-associativity of FP arithmetic
- Floating-point addition is not associative: \( (x + y) + z \neq x + (y + z)\) in general because each addition is rounded separately.[page:12]  
- Example: \(x = 10^{16}, y = -10^{16}, z = 1\):  
  - \((x + y) + z = 0 + 1 = 1\) but  
  - \(x + (y + z) \approx 10^{16} + (-10^{16}) = 0\) after rounding.[page:12]  
- Reordering operations changes error terms and thus the final result, which is crucial in parallel sums and reductions.[page:12]

## 13. Compilers, optimizations, and FP
- Compilers may reassociate expressions, vectorise loops, drop NaN/Inf checks, and assume no overflow when using fast-math flags (e.g. `-Ofast`, `-ffast-math`).[page:12]  
- Without such flags (e.g. `gcc -O0`), compilers preserve source order and IEEE-754 semantics, often using wider internal precision (e.g. 80-bit x87) but at lower performance.[page:12]  
- With optimizations (`-O2`, `-O3`), code may switch to SSE/AVX, using strict 64-bit doubles and more aggressive reordering, changing numerical results compared to unoptimized builds.[page:12]

## 14. Parallel reductions (OpenMP, MPI) and reproducibility
- Parallel reductions split sums into chunks (e.g. 10 OpenMP threads each summing a segment, then combining), changing the order of additions and thus the final result.[page:12]  
- Dynamic scheduling, changing thread counts, or MPI process counts can lead to run-to-run differences even with identical inputs.[page:12]  
- Getting bitwise-identical results across runs and platforms is difficult; most HPC work accepts small FP differences as long as they are within error tolerances.[page:12]

## 15. Programming guidelines for FP comparisons
- Never compare FP values using `==` for numerical equality, because rounding and representation errors make exact bitwise equality unreliable.[page:12]  
- Use relative/absolute tolerance checks, e.g.  
  ```cpp
  if (std::abs(x - y) / std::max(std::abs(x), std::abs(y)) < 1e-10) {
      // treat x and y as equal
  }
  ```[page:12]  
- `==` *can* be used to detect NaNs (`x == x` is false for NaN), but standard helpers like `std::isnan`, `std::isfinite`, `std::isinf`, `std::isnormal` are clearer and safer.[page:12]

```markdown
# CS402 Lecture 2: Fundamental Ideas – Representing Numbers (Detailed Explanation)

This lecture covers why and how computers represent real numbers using fixed-point and floating-point formats, IEEE 754 standards, errors, precision, and pitfalls in FP arithmetic, especially relevant for high-performance scientific computing in CS402.[page:12]

## Continuous Maths on Discrete Machines (Slides 1-2)
Real numbers from \(\mathbb{R}\) have infinite digits, so computers truncate them to fit finite bits.[page:12]  
Flexible bit counts per number would bloat memory and slow hardware; instead, fixed-size formats approximate values like \(1/3\) or \(\pi\).  
This approximation is essential for all numerical HPC simulations.

## Outline (Slide 3)
Key topics: fixed-point limits, error types, IEEE FP, machine epsilon, comparisons, reproducibility – foundational for understanding why parallel FP codes need careful numerical analysis.[page:12]

## Fixed-Point Representation (Slide 4)
Fixed-point uses a fixed binary point position, e.g., \(3.625_{10} = 11.101_2\) in 8 bits as `0011.1010`.[page:12]  
It suits narrow ranges (e.g., 8 bits: 0 to 15.9375) but fails for science: sun mass (\(1.989 \times 10^{33}\) g) vs. electron mass (\(9.109 \times 10^{-28}\) g) needs ~208 bits, mostly wasted zeros.[page:12]  
Financial apps use it for exact decimals, but HPC demands wider dynamic range.

## Error, Accuracy, Precision (Slides 5-6)
Absolute error \(e = |x_m - x|\), relative \(\epsilon = e / |x|\); e.g., approximating \(1/3 \approx 0.33\) gives \(e=0.00333\), \(\epsilon=0.01\).  
**Precision**: significant digits (infinite in math, finite in machines); **accuracy**: closeness to true value – high precision can still be inaccurate if early digits err.[page:12]  
Algorithms must maximise accuracy given precision; visual: bullseye analogy where clustered but off-center shots are precise but inaccurate.

## Floating-Point Representation (Slide 7)
FP lets the point "float": \(x = \text{mantissa} \times 2^\text{exponent}\), e.g., 8-bit toy (5 mantissa + 3 exponent) covers 0.5 to 124 vs. fixed-point's tiny range.[page:12]  
Normalisation shifts to \(0.1\dots\) or \(1.\dots\) form before truncating/rounding mantissa; hugely expands range efficiently.

## Truncation vs. Rounding (Slide 8)
Truncation chops bits (biased downward error); rounding adds 1 to LSB if discarded bits > ½ LSB (unbiased).[page:12]  
E.g., \(0.1101101_2\) truncates to \(0.1101\), rounds to \(0.1110\); rounding preferred despite extra op, as it centres errors statistically.

## IEEE 754 Standard (Slides 9-10)
Normalised: \(\pm (1 + \text{mantissa}) \times 2^\text{exponent}\).[page:12]  
**FP32**: 1 sign + 8 exp + 23 mant; **FP64**: 1+11+52. Exponent biased (+127 FP32, +1023 FP64) for unsigned storage, range ~\([-126,127]\).[page:12]  
E.g., \(-1010011.101101011_2 = -1.010011101101011 \times 2^6\), stored exp=1029.

## Special Values (Slides 11-12)
Exp=all 1s (2047), mant≠0: NaN (propagates, avoids fake results for 0/0).[page:12]  
Exp=2047, mant=0: \(\pm \infty\); exp=0, mant=0: \(\pm 0\). Exp=0, mant≠0: **denormals** (gradual underflow, but slow/fragile – avoid in perf code).[page:12]

## FP Distribution (Slides 13-14)
FP spacing doubles per exponent increase; constant **relative** precision (ulp ~ \(\epsilon \times x\)), not absolute.[page:12]  
Number line: denormals near zero → normals → \(\pm \infty\), NaNs anywhere.

## Machine Precision (Slides 15-16)
\(\epsilon\): smallest rel spacing near 1, or smallest \(\epsilon >0\) where \(1 + \epsilon = 1\) (FP32: \(2^{-23} \approx 10^{-7}\); FP64: \(2^{-52} \approx 10^{-16}\)).[page:12]  
Code: halve \(\epsilon\) until no change in \(1 + \epsilon\).

## Rounding Error Example (Slide 17)
\(0.1_{10}\) binary-infinite; rounded FP64 rel error \(\approx 5.55 \times 10^{-17} \le \epsilon/2\).[page:12]  
Single rounding bounded by half ulp relatively.

## FP Operations (Slides 18-20)
Each op rounds: \(x \oplus y = (x+y)(1+\epsilon)\), etc., with \(|\epsilon| \le\) machine prec; neglect \(\epsilon^2\), combine as \(n\epsilon\).  
Rel error scales with magnitude; machines often use wider internal prec (80-bit) before final round.

## Non-Associativity (Slide 21)
\((x+y)+z \neq x+(y+z)\); e.g., \(x=10^{16}, y=-10^{16}, z=1\): left=1, right=0 due to rounding order.[page:12]  
Error terms depend on partial sums.

## Compiler Effects (Slides 22-23)
`-O0`: preserves order, may use slow 80-bit x87.[page:12]  
`-O2/-ffast-math`: reorders, vectorises SSE/AVX (strict 64-bit), drops NaN checks – faster but changes results.

## Parallel Reductions (Slide 24)
OpenMP/MPI splits sums → different chunk orders → varying results per run (dynamic scheduling, net latency).[page:12]  
Bitwise reproducibility hard/unneeded; tolerate small diffs.

## Programming Guidelines (Slides 25-26)
Never `x == y`; use rel tol: `abs(x-y)/max(|x|,|y|) < 1e-10`.[page:12]  
`std::isnan(x)`, `std::isfinite(x)`, etc. for specials (NaN: `x != x`).

## Reading (Slide 27)
Goldberg (1991) survey; Weinzierl Ch4/6; YouTube "What Every Programmer Should Know"; Oracle NCG Ch2.[page:12]
```

[1](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/cs402-2-fundamentalideas-1.pdf)

## 16. Recommended reading
- David Goldberg, *What every computer scientist should know about floating-point arithmetic*, ACM Computing Surveys 23(1), 1991.[page:12]  
- Tobias Weinzierl, chapters 4 and 6 (and 8 as extra) in his HPC/parallel scientific computing text.[page:12]  
- Online: Oracle *Numerical Computation Guide* (Chapter 2) and talks such as “What every programmer should know about floating point arithmetic” (YouTube).[page:12]
```

[1](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/cs402-2-fundamentalideas-1.pdf)


