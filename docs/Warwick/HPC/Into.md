# Introduction to HPC

Why simulation and HPC matter
Simulation is the third pillar of science alongside theory and experiment; it is used when experiments are impossible, dangerous, or too expensive.
​

Many governing equations (e.g. Navier–Stokes for fluids, Black–Scholes for options, Schrödinger for quantum systems) rarely have closed-form solutions and must be solved numerically on computers.
​

From PDEs to massive computation
Discretizing PDEs (e.g. heat equation) on 3D grids leads to billions of unknowns; each time step is a stencil update over the whole grid.
​

Such problems require huge memory, trillions of floating-point operations, and heavy data movement, so performance is limited more by memory bandwidth than raw FLOPs on a single core.
​

Levels of parallelism
Parallelism exists at several levels: instruction-level (pipelining, SIMD), thread-level (OpenMP, SIMT on GPUs), process-level (MPI across nodes), and job-level (many independent runs on a cluster).
​

Real HPC codes usually combine these levels (e.g. MPI between nodes + OpenMP/CUDA within nodes) for scalability.
​

Hardware landscape
Modern HPC uses multi-core CPUs with wide SIMD, GPUs, heterogeneous CPUs+GPUs, FPGAs, and AI accelerators.
​

Exascale systems (e.g. Aurora, Frontier, LUMI, El Capitan, and upcoming UK exascale) deliver around 
  floating-point operations per second but are highly parallel and power-constrained, so efficient parallel code is essential.
​

What CS402 will teach
Focus areas: numerical simulation workflow, shared-memory parallelism with OpenMP, distributed-memory parallelism with MPI, GPU programming with CUDA, and performance engineering on clusters.
​
Two main courseworks revolve around a 2D CFD Kármán vortex street solver, progressively parallelised using OpenMP, CUDA, and MPI, mirroring real scientific HPC practice.
