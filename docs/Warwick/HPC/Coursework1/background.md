Let’s rebuild the background from scratch, and we’re just reasoning it out from “what is a fluid?” upwards.

***

## 1. What are we actually trying to describe?

First question: *What does this solver want to predict?*  

It wants to know, at every point in a 2D box: [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

- How fast the fluid moves horizontally: $(u(x,y,t))$ (x–velocity). [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)
- How fast it moves vertically: $(v(x,y,t))$ (y–velocity). [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)
- What the pressure is: $(p(x,y,t))$. [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

So the unknowns are **velocity field** $((u,v))$ and **pressure field** $(p)$ in time.

***

## 2. What kind of fluid is this?

Next natural question: *What kind of fluid behaviour are we assuming?*  

Karman assumes: [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

- **Incompressible**: density is constant, no “squeezing” or “expanding” of fluid chunks.  
- **Newtonian**: viscosity acts in a simple, linear way (like water, not like ketchup).  
- **2D flow**: we only care about x and y directions.

“Incompressible” is the big one: it means if you draw a small box in the fluid, **what flows into the box must equal what flows out** (no fluid magically appears or disappears). [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

***

## 3. How do we write “no fluid created or destroyed” in math?

Now: *How do we turn “nothing is created or destroyed” into an equation?*  

Think of a tiny box of fluid with velocity \((u,v)\) at each point. If more fluid is entering than leaving, the box’s content would change, which is not allowed for incompressible flow. The mathematical way to say “no net in or out” is: [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

$[
\frac{\partial u}{\partial x} + \frac{\partial v}{\partial y} = 0
]$

This is the **continuity equation** for incompressible flow (mass conservation). [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

- $(\partial u / \partial x)$ measures how much x-velocity is “spreading out” in x.  
- $(\partial v / \partial y)$ measures how much y-velocity is “spreading out” in y.  
- Their sum being zero means there is no net expansion or compression.

So: **Equation 1 = “no fluid is magically created or destroyed.”** [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

***

## 4. How do we track how a fluid particle accelerates?

Next: *How does a fluid particle speed up, slow down, or change direction?*  

In mechanics, acceleration comes from forces (Newton’s second law). For each fluid particle, acceleration equals the sum of forces: [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

- Forces from **pressure** (high to low pressure pushes fluid).  
- Forces from **viscosity** (like friction inside the fluid, smoothing velocity differences).  
- Plus the fact that the particle is moving through space (convection).

In 2D, we write separate equations for the x and y components of velocity:

**x-momentum (for u):** [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

$$[
\frac{\partial u}{\partial t}
+ u \frac{\partial u}{\partial x}
+ v \frac{\partial u}{\partial y}
= -\frac{\partial p}{\partial x}
+ \nu \nabla^2 u
]$$

**y-momentum (for v):** [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

$$[
\frac{\partial v}{\partial t}
+ u \frac{\partial v}{\partial x}
+ v \frac{\partial v}{\partial y}
= -\frac{\partial p}{\partial y}
+ \nu \nabla^2 v
]$$

Where: [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

- $(\partial u/\partial t)$, $(\partial v/\partial t)$: time change of velocity.  
- $(u \partial u/\partial x + v \partial u/\partial y)$: **convection** (particle moving through different velocities).  
- $(-\partial p/\partial x), (-\partial p/\partial y)$: **pressure forces**.  
- $(\nu \nabla^2 u), (\nu \nabla^2 v)$: **viscous diffusion**, with $(\nu)$ = kinematic viscosity and $(\nabla^2)$ the Laplacian. [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

So these two are just: **“Newton’s law applied to a fluid, in x and y directions.”** [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

***

## 5. Why is this hard to solve directly?

Obvious question: *Why not just solve these equations with pen and paper?*  

Because they are: [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

- **Nonlinear** (those $(u \partial u/\partial x)$ terms).  
- **Coupled**: u and v depend on p, and p is linked back via incompressibility.  
- Full 2D in space + time.

Analytical solutions exist only for very simple cases (e.g., super-symmetric setups). For flow around an obstacle with vortices (Kármán street), that’s much too complex. [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

So Karman must **approximate** the solution numerically on a grid. [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

***

## 6. How do we convert continuous space into something a computer understands?

Next: *How do we represent a continuous fluid field on a discrete machine?*  

Karman: 

- Builds a **2D Cartesian grid**: `imax × jmax` cells.  
- Each cell $((i,j))$ stores:
  - $(u_{i,j})$: x-velocity.  
  - $(v_{i,j})$: y-velocity.  
  - $(p_{i,j})$: pressure.  
  - `flag[i,j]`: fluid cell (`CF`) or obstacle (`CB`). 

Grid spacings are $(\Delta x)$ and $(\Delta y)$. 

Now all fields become **arrays**, and derivatives become **finite differences**. 

***

## 7. How do we approximate derivatives on this grid?

Question: *How do we turn derivatives like $(\partial u/\partial x)$ into operations on an array?*  

They use **second-order finite differences**: 

- Laplacian of pressure (Poisson equation) at $((i,j))$: 

$$
\nabla^2 p_{i,j} =
\frac{p_{i+1,j} - 2p_{i,j} + p_{i-1,j}}{\Delta x^2}
+
\frac{p_{i,j+1} - 2p_{i,j} + p_{i,j-1}}{\Delta y^2}
$$

- First derivatives (central differences), e.g.: 

$$
\frac{\partial u}{\partial x}\bigg|_{i,j}
\approx
\frac{u_{i+1,j} - u_{i-1,j}}{2\Delta x}
$$

…and similar for $(\partial v/\partial x)$, $(\partial u/\partial y)$, $(\partial v/\partial y)$. 

Key idea: each update uses the **cell and its 4 neighbours** → a **5-point stencil**.   
This is exactly what makes Karman very parallel-friendly later.

***

## 8. How does Karman enforce incompressibility in practice?

Now the subtle part: *How do we make sure $(\partial u/\partial x + \partial v/\partial y = 0)$ after each time step?*  

If we just update u and v from the momentum equations directly, incompressibility will generally be violated. So Karman uses a **fractional-step (projection) method**: [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

1. **Ignore pressure for a moment and predict a “tentative” velocity.**  
   Compute $(f)$ and $(g)$: [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

   $$
   f = u^n + \Delta t \left( -u \frac{\partial u}{\partial x}
   - v \frac{\partial u}{\partial y}
   + \nu \nabla^2 u \right)
   $$

   $$
   g = v^n + \Delta t \left( -u \frac{\partial v}{\partial x}
   - v \frac{\partial v}{\partial y}
   + \nu \nabla^2 v \right)
   $$

   These are velocities advanced by convection and diffusion only. They generally **do not satisfy** incompressibility. [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

2. **Measure how much incompressibility is violated and solve a pressure Poisson equation.**  
   From continuity with $(f,g)$, we derive the discrete pressure equation: 

  $$
   \nabla^2 p_{i,j} = \frac{1}{\Delta t}
   \left(
   \frac{f_{i,j} - f_{i-1,j}}{\Delta x}
   +
   \frac{g_{i,j} - g_{i,j-1}}{\Delta y}
   \right)
  $$

   This says: pressure must adjust such that the final velocity field becomes divergence-free again. 

3. **Correct the tentative velocity using pressure gradients.**  
   Once p is known, we correct: [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

   $$
   u^{n+1}_{i,j} = f_{i,j}
   - \Delta t \frac{p_{i+1,j} - p_{i,j}}{\Delta x}
   $$

   $$
   v^{n+1}_{i,j} = g_{i,j}
   - \Delta t \frac{p_{i,j+1} - p_{i,j}}{\Delta y}
   $$

   After this correction, the velocity field satisfies incompressibility (up to numerical error). 

So the **core idea**:  

- First, let the fluid move “freely” without pressure (tentative step).  
- Then compute a pressure field whose only job is to **fix the divergence** and enforce incompressibility.

***

## 9. How is the pressure Poisson equation solved?

Final key piece: *We now have a big linear system (Poisson equation) for p. How do we solve it efficiently?*  

Karman uses **Successive Over-Relaxation (SOR)**, with a **Red–Black ordering**: 

- SOR updates pressure iteratively: 

  $$
  p^{k+1}_{i,j}
  = (1 - \omega)p^k_{i,j}
    + \frac{\omega}{4}
    \left(
      p^k_{i+1,j} + p^{k+1}_{i-1,j}
      + p^k_{i,j+1} + p^{k+1}_{i,j-1}
      - h^2 \, \text{rhs}_{i,j}
    \right)
  $$

  where $(\omega)$ is the relaxation parameter and `rhs` is the right-hand side from the discretised Poisson equation. 

- Standard SOR has a **wavefront dependency** (each update uses newest neighbours), which is bad for parallelism.   
- Red–Black SOR colours the grid like a chessboard and updates all **red cells** using black neighbours, then all **black cells** using red neighbours, breaking the chain of dependencies and enabling parallel updates per colour. 

Once the pressure iterations converge, velocities are corrected and the next time step starts. 

***

Let’s first make sense of **what this coursework is really about**, then zoom into Coursework 1 and the Karman solver step by step.

***

## 1. What is the big picture here?

The whole assignment is about taking a **realistic physics simulation** (fluid flowing around an obstacle) and asking:  
“Why is this so slow on one core, and how can we systematically speed it up using parallelism?” [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

So there are two layers:

- **Physics / math layer**: Navier–Stokes equations, incompressible flow, vortices behind an obstacle (von Kármán vortex street). [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)
- **HPC layer**: OpenMP (coursework 1), then MPI and MPI+OpenMP (coursework 2), possibly GPUs. [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

You don’t need to be a CFD god; you mainly need enough understanding to see **why the loops look the way they do** and **where the parallelism lives**. [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

***

## 2. Who is von Kármán and what is this “vortex street”?

**Natural question:** What is “Karman” even solving?

- The code is a **2D incompressible fluid solver**: think water/air flowing in a channel past a circular obstacle. [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)
- As the fluid passes the obstacle, it doesn’t just go smoothly; it sheds alternating vortices (swirls) downstream. This repeating pattern is called a **von Kármán vortex street**. [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

**Who was von Kármán?**

- **Theodore von Kármán** (1881–1963) was a Hungarian mathematician/engineer who did major work in aerodynamics. The swirling pattern behind a bluff body in a flow was analysed by him, hence the name. [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

So the code is basically a numerical experiment that recreates this classic vortex street behind a cylinder-like obstacle. When you visualise `karman.bin`, you should see a wake with a wavy pattern of high/low velocity downstream. 

***

## 3. What equations is Karman actually solving?

**Question:** What is the physics problem in math form?

For a 2D incompressible fluid, the main pieces are: [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

1. **Incompressibility (mass conservation)**  
   $(\partial u / \partial x + \partial v / \partial y = 0)$ — “no fluid is magically created or destroyed inside a small box.” [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

2. **Momentum equations (Navier–Stokes in x, y)**  
   These describe how velocity changes due to:
   - Convection (fluid carrying momentum along)  
   - Diffusion (viscosity smoothing things)  
   - Pressure forces  
   - Time evolution [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

Karman doesn’t solve these analytically (impossible for realistic flows), so it **approximates them numerically on a grid**. [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

***

## 4. How is the domain discretised and stored in memory?

**Question:** How do we turn continuous fluid into something a computer can store?

- The 2D domain is a **uniform Cartesian grid** of size `imax × jmax`.   
- Each grid cell is a **control volume** where we store:  
  - `u[i,j]`: x-velocity  
  - `v[i,j]`: y-velocity  
  - `p[i,j]`: pressure  
  - `flag[i,j]`: fluid cell (`CF`) or obstacle (`CB`) 

Visually, you have a rectangle of cells, with some interior region flagged as obstacle cells (the cylinder), surrounded by fluid cells. 

This grid structure is key for **parallelism**, because most operations are **the same stencil over all fluid cells**.

***

## 5. What is a stencil and why is it important here?

**Question:** How do we approximate derivatives on this grid?

They use **finite differences**: each derivative is computed using a small pattern (stencil) around a cell. 

- Laplacian of pressure at `(i,j)` uses **five-point stencil**: center + N, S, E, W neighbours.   
- First derivatives (like ∂u/∂x) use differences of neighbour values. 

This has two key properties for HPC:

- **Locality**: each update needs only the cell and its 4 neighbours.   
- **Uniform loops**: you run the same calculations over all interior cells.

This is exactly the kind of pattern that is easy to parallelise: “for all cells, do the same small local computation.”

***

## 6. How does the time-stepping algorithm work conceptually?

**Question:** If the flow changes over time, how does the code step forward?

The solver uses an **explicit time-stepping scheme** with a **fractional-step (projection) method**: [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

At each time step:

1. **Set a stable time step ∆t** ([`set_timestep_interval()`])  
   - Chosen to keep the explicit scheme numerically stable (CFL-like constraints). 

2. **Compute tentative velocities f and g** ([`compute_tentative_velocity()`])  
   - Advance momentum equations *without* pressure.  
   - These include convection and diffusion, but do not yet satisfy incompressibility. [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

3. **Compute RHS of pressure Poisson equation** ([`compute_rhs()`])  
   - Measures how much the tentative velocities violate incompressibility. 

4. **Solve pressure Poisson equation using Red–Black SOR** ([`poisson()`])  
   - Find pressure field `p` that will fix the divergence. 

5. **Correct velocities with pressure gradient** ([`update_velocity()`])  
   - Use `p` to adjust `f` and `g` to get divergence-free `u` and `v`. [warwick.ac](https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs402/hpc-coursework-2025_2026.pdf)

6. **Apply boundary conditions** ([`apply_boundary_conditions()`])  
   - Enforce walls, obstacle, etc. 

Then repeat for the next time step. 

From an HPC perspective, **steps 2–5 are heavy loop-based computations** on the grid and are your main targets for parallelisation. 

***

## 7. What is SOR and what is Red–Black SOR?

**Question:** Solving a Poisson equation sounds expensive. How do they do it?

The pressure Poisson equation is solved iteratively using **Successive Over-Relaxation (SOR)**. 

- Standard SOR updates `p[i,j]` using neighbours, but the update depends on the already-updated neighbour (Gauss–Seidel style), which creates a **wavefront dependency** that is quite sequential. 

To make it more parallel-friendly, they use **Red–Black SOR**: 

- Colour the grid in a checkerboard pattern: red cells and black cells.   
- Update all red cells using black values, then all black cells using red values.   
- Within one colour, cells are independent and can be updated in parallel. 

This is deeply relevant for your OpenMP loops: you will likely have **two loops** per SOR iteration: one over red cells, one over black cells, each of which can be parallelised. 

***

## 8. What exactly is Coursework 1 asking you to do?

Now, let’s zoom into **Coursework 1 – OpenMP Parallelization**. 

### 8.1 Task summary

**Core task (1.2):**

> Using only OpenMP, parallelise `karman` to run on multi-threaded CPUs. Benchmark  
> (1) the runtime of the total program and  
> (2) the runtime of each loop  
> over a varying number of threads. Analyse the overhead of OpenMP. 

So the required outcomes are:

- A **correct OpenMP-parallel version** of the code that still runs with the same command-line interface and I/O.   
- **Timing measurements**:
  - Whole program runtime vs thread count.
  - Individual loop runtimes vs thread count.   
- **Analysis of OpenMP overhead** (where it helps, where it hurts). 

Only OpenMP is allowed for this coursework. 

***

### 8.2 Getting started & running the code

The instructions: 

- Load module and build:
  - `module load cs402-mpi`  
  - `make CC=mpicc` 
- Run: `./karman`  
  - By default, it solves a small problem and writes `karman.bin`. 
- View solution:
  - Convert to image: `./bin2ppm < karman.bin > karman.ppm`  
  - Optionally convert PPM to JPEG with `ppm2jpeg`. 
- You can generate a sequence of frames using `batchrun.sh` and then a video via ffmpeg. 

This is useful to visually check that your parallelisation **has not broken the physics**.

***

### 8.3 Runtime options

You can change problem size and simulation settings via CLI options: 

- `-x`, `--imax`: number of interior cells in X  
- `-y`, `--jmax`: number of interior cells in Y  
- `-t`, `--t-end`: end time  
- `-d`, `--del-t`: time step size  
- `-i`, `--infile`, `-o`, `--outfile` 

The **default mesh** is `660 × 120`, about 1 second runtime on a single 1.5 GHz core. Doubling size fourfolds runtime (roughly \(O(N^2)\) size → more than linear time), so larger meshes quickly become expensive. 

This motivates parallelisation: as resolution increases, serial time becomes too big. 

***

### 8.4 Checking correctness

After you modify the code, you must check that the solution is still correct: 

- Use `diffbin`:
  - `./diffbin karman.vanilla.bin karman.bin`  
  - Compares absolute and relative errors between serial and your parallel version. 
- `diffbin_ext` gives location of max error and which field. 

The marking expects: relative error vs serial to be **less than machine precision**. 

So your OpenMP changes must not alter the numerical results beyond rounding noise.

***

### 8.5 Profiling and finding hotspots

**Question:** Where should you parallelise first?

They explicitly tell you to profile: 

- Add `-pg` to `CFLAGS` in `Makefile` (for `gprof`).   
- Rebuild and run:
  - `make clean all`
  - `./karman`
  - `gprof ./karman` 

This gives a sorted list of functions by time spent. 

You should focus on:

- The **main computational loops** (finite-difference stencils, SOR, etc.),  
- Not on tiny helper functions or I/O.

You’ll likely see heavy time in:

- Tentative velocity computation  
- RHS computation  
- Poisson/SOR iterations  
- Velocity update

These map directly to steps 2–5 of the main loop. 

***

## 9. What exactly must be in the Coursework 1 report?

For Coursework 1, you also need a **Performance Analysis Report** (max 4 A4 pages, ≥ 9pt font, excluding references). 

The report should include: 

- Which **OpenMP pragmas** you used and their effect on performance.  
- Choice of **iteration scheduling** (e.g. static, dynamic) and why.  
- Any **code changes** made to enable or improve parallelisation.  
- **Benchmark results** (graphs or tables):
  - Whole program runtime vs thread count.
  - Key loops runtime vs thread count.
- **Analysis of OpenMP overhead**:
  - Where parallelisation didn’t help or got worse (thread creation, synchronisation, false sharing, etc.). 

The submission: your **best-performing OpenMP code**, plus the report, submitted via Tabula by **Monday 10th February 2026 at 12 noon (Week 5)**. 

They emphasise:

- Marking is anonymous: use your **University card number**, not your name.   
- Only OpenMP is allowed.   
- Code must compile and run as per Section 1.1.   
- Accuracy checked with `diffbin`, over multiple problem sizes. 

***

## 10. What about generative AI and plagiarism here?

They give explicit guidance: 

- You can use GAITs (ChatGPT, Gemini, Copilot, etc.) **if you acknowledge where and how**:
  - Note it in the report.
  - Comment in code where AI-assisted snippets are used.
  - Submit prompts and generated code/text with your solution. 

- Final code must still be **your own, understood by you**; you may be called to a viva to prove ownership. 

They warn:

- AI-generated parallel code often has **bugs, race conditions, deadlocks, poor performance**, especially for parallel programming.   
- If you just copy code without understanding, your debugging time and “technical debt” will blow up. 

So you can use tools as helpers, but you have to reason about correctness and performance yourself.

***

If you like, next we can go in **first-principles style** into one specific part, for example:

- “Why does the Poisson solve dominate runtime, and how do OpenMP loops and Red–Black colouring interact?”  
- Or “How to systematically decide which loops to parallelise first and how to measure OpenMP overhead?”