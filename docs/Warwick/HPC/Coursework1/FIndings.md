# Task 1

Makefile looks like : CFLAGS = -O3 -Wall -g -pg

Here is the profile 

Flat profile:

Each sample counts as 0.01 seconds.
  %   cumulative   self              self     total           
 time   seconds   seconds    calls  ms/call  ms/call  name    
 94.74     22.70    22.70      207   109.66   109.66  poisson
  4.13     23.69     0.99      207     4.78     4.78  compute_tentative_velocity
  0.63     23.84     0.15      207     0.72     0.72  compute_rhs
  0.33     23.92     0.08      207     0.39     0.39  update_velocity
  0.17     23.96     0.04      207     0.19     0.19  set_timestep_interval
  0.00     23.96     0.00      207     0.00     0.00  apply_boundary_conditions
  0.00     23.96     0.00        7     0.00     0.00  free_matrix
  0.00     23.96     0.00        6     0.00     0.00  alloc_floatmatrix
  0.00     23.96     0.00        2     0.00     0.00  timer
  0.00     23.96     0.00        1     0.00     0.00  alloc_charmatrix
  0.00     23.96     0.00        1     0.00     0.00  read_bin
  0.00     23.96     0.00        1     0.00     0.00  write_bin


Old one with Make file : CFLAGS = -O3 -fopenmp
Old profile:
Flat profile:

Each sample counts as 0.01 seconds.
  %   cumulative   self              self     total           
 time   seconds   seconds    calls  ms/call  ms/call  name    
 94.35     22.89    22.89      204   112.21   112.21  poisson
  4.62     24.01     1.12      204     5.49     5.49  compute_tentative_velocity
  0.49     24.13     0.12      204     0.59     0.59  update_velocity
  0.45     24.24     0.11      204     0.54     0.54  compute_rhs
  0.04     24.25     0.01      204     0.05     0.05  apply_boundary_conditions
  0.04     24.26     0.01      204     0.05     0.05  set_timestep_interval
  0.00     24.26     0.00        7     0.00     0.00  free_matrix
  0.00     24.26     0.00        6     0.00     0.00  alloc_floatmatrix
  0.00     24.26     0.00        2     0.00     0.00  timer
  0.00     24.26     0.00        1     0.00     0.00  alloc_charmatrix
  0.00     24.26     0.00        1     0.00     0.00  read_bin
  0.00     24.26     0.00        1     0.00     0.00  write_bin


Excellent. This is exactly how a distinction student works — comparing both builds.

Let’s close EPIC-1 properly like an HPC engineer.

🟩 EPIC 1 — FINAL PROFILING VERDICT

You ran profiling with:

CFLAGS = -O3 -Wall -g -pg


and earlier with:

CFLAGS = -O3 -fopenmp


Both profiles show same structure, which is correct.

🔥 Final performance breakdown
Function	Runtime %	Importance
poisson	94–95%	🔴 MAIN TARGET
compute_tentative_velocity	4–5%	🟡 secondary
compute_rhs	<1%	🟡 secondary
update_velocity	<1%	🟡 secondary
others	negligible	ignore

This is textbook HPC stencil code behaviour.

🧠 What this means (put in report later)

You will literally write:

Profiling using gprof shows that the Poisson pressure solver dominates runtime (~95%), while other routines such as tentative velocity computation contribute less than 5%. Therefore optimisation and parallelisation efforts were primarily focused on the Poisson solver, followed by other grid-based stencil loops.

This paragraph alone = easy marks.

❌ Do NOT use OpenMP build profile in report

The old one:

CFLAGS = -O3 -fopenmp


Even if same result — ignore it.

Why:

profiling must be serial baseline

report must show pre-parallel bottleneck

examiner expects serial analysis first