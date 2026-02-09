Here is the **exact step-by-step way to run and test the Karman coursework application** on your system.

Follow this strictly — this is also what examiners expect you to know.

---

# 🟦 STEP 1 — Unzip the project

If not already extracted:

```bash
unzip karman.zip
cd karman
```

You should see files like:

```
Makefile
main.c
poisson.c
uvp.c
boundary.c
bin2ppm
diffbin
```

---

# 🟦 STEP 2 — Load required module (IMPORTANT on university systems)

Your coursework PDF specifies:

```bash
module load cs402-mpi
```

Run this first.

If using your own Mac/Linux and module not found → skip this step.

---

# 🟦 STEP 3 — Compile the program

Compile using make:

```bash
make clean
make CC=mpicc
```

If compilation succeeds → you will see executable:

```
karman
```

---

# 🟦 STEP 4 — Run the simulation (basic run)

Run default simulation:

```bash
./karman
```

This will:

* Run CFD simulation
* Generate binary output file: `karman.bin`
If it runs correctly → terminal will show time-step logs.

---

# 🟦 STEP 5 — Convert output to image (visual test)

To check simulation visually:

```bash
./bin2ppm < karman.bin > output.ppm
```

Now open image:

Mac:

```bash
open output.ppm
```

Linux:

```bash
display output.ppm
```

You should see:
👉 Flow around cylinder (vortex street)

If image appears → simulation working correctly.

---

# 🟦 STEP 6 — Run with custom grid size (testing)

You can test different grid sizes:

```bash
./karman -x 660 -y 120
```

or large case:

```bash
./karman -x 1000 -y 500
```

These are used later for benchmarking.

---

# 🟦 STEP 7 — Run with OpenMP threads (after parallelisation)

Once you add OpenMP:

```bash
export OMP_NUM_THREADS=1
./karman

export OMP_NUM_THREADS=4
./karman

export OMP_NUM_THREADS=8
./karman
```

This tests scaling.

---

# 🟦 STEP 8 — Correctness testing (VERY IMPORTANT FOR MARKS)

After parallelising, you must confirm output is identical to serial.

### First run serial version

```
export OMP_NUM_THREADS=1
./karman
mv karman.bin serial.bin
```

### Run parallel version

```
export OMP_NUM_THREADS=8
./karman
```

### Compare outputs

```
./diffbin serial.bin karman.bin
```

Expected:

```
difference ~ 1e-15
```

If large error → you introduced race condition.

---

# 🟦 STEP 9 — Measure runtime

Simple timing:

```bash
time ./karman -x 660 -y 120
```

Or inside code using:

```
omp_get_wtime()
```

You will need runtime data for report.

---

# 🟦 STEP 10 — Full testing checklist (for submission)

Before submitting ensure:

✔ Compiles without error
✔ Runs without crash
✔ Works for multiple threads
✔ Image output correct
✔ diffbin passes
✔ Runtime improves with threads

---

# 🚨 Common errors students face

### Error: mpicc not found

Use:

```
make
```

instead of mpicc OR load module.

### Error: program slow

Normal — serial version slow before parallelisation.

### Error: wrong output after OpenMP

Race condition introduced.

### Error: no speedup

Parallelised wrong loops.

---

# 🧠 What examiner expects you to know

You must be able to:

* Compile
* Run
* Visualise output
* Test correctness
* Benchmark threads

If you can’t run → you cannot parallelise.

---

# 🚀 Next step (important)

Now tell me honestly:

Does it run on your system?

Reply:

1. Runs perfectly
2. Compilation error
3. Runtime crash
4. Using Mac local machine
5. Using university HPC

Tell me which — I’ll guide exactly.
