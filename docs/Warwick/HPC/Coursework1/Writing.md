# Task 1: 
In report section “Profiling”:

The application was profiled using gprof to identify computational bottlenecks. Results show that the Poisson pressure solver accounts for approximately 95% of total runtime. The compute_tentative_velocity function contributes around 4–5%, while all other functions contribute less than 1%. Therefore, optimisation and OpenMP parallelisation efforts were focused primarily on the Poisson solver and major stencil computation loops.

Flat profile:

Each sample counts as 0.01 seconds.
  %   cumulative   self              self     total           
 time   seconds   seconds    calls  ms/call  ms/call  name    
 94.49     23.13    23.13      211   109.62   109.62  poisson
  4.58     24.25     1.12      211     5.31     5.31  compute_tentative_velocity
  0.41     24.35     0.10      211     0.47     0.47  compute_rhs
  0.41     24.45     0.10      211     0.47     0.47  update_velocity
  0.12     24.48     0.03      211     0.14     0.14  set_timestep_interval
  0.00     24.48     0.00      211     0.00     0.00  apply_boundary_conditions
  0.00     24.48     0.00        7     0.00     0.00  free_matrix
  0.00     24.48     0.00        6     0.00     0.00  alloc_floatmatrix
  0.00     24.48     0.00        2     0.00     0.00  timer
  0.00     24.48     0.00        1     0.00     0.00  alloc_charmatrix
  0.00     24.48     0.00        1     0.00     0.00  read_bin
  0.00     24.48     0.00        1     0.00     0.00  write_bin


# Baseline
Make file : 
CFLAGS = -O3 -Wall -g -fopenmp

./karman
Simulation complete.
Elapsed time: 26.1217 sec 

Perfect. This is now your official serial baseline.

Write this down somewhere:

Serial runtime (1 thread) = ~26.1 sec
Compiler flags: -O3 -Wall -g -fopenmp


Even though -fopenmp is present, program is still serial
because we haven’t added any #pragma omp yet.

This runtime will be used later for:

speedup graphs

performance report

comparison

# Task 2
Added pragma in compute_tentative_velocity: 

[u5718324@kudu-taught karman]$ make clean
rm -f bin2ppm diffbin diffbin_ext pingpong colcopy karman karman-par *.o
[u5718324@kudu-taught karman]$ make clean
rm -f bin2ppm diffbin diffbin_ext pingpong colcopy karman karman-par *.o
[u5718324@kudu-taught karman]$ make CC=mpicc
mpicc -c -O3 -Wall -g -fopenmp alloc.c
mpicc -c -O3 -Wall -g -fopenmp boundary.c
mpicc -c -O3 -Wall -g -fopenmp init.c
mpicc -c -O3 -Wall -g -fopenmp karman.c
mpicc -c -O3 -Wall -g -fopenmp simulation.c
mpicc -O3 -Wall -g -fopenmp -o karman alloc.o boundary.o init.o karman.o simulation.o -lm
mpicc -c -O3 -Wall -g -fopenmp bin2ppm.c
mpicc -O3 -Wall -g -fopenmp -o bin2ppm bin2ppm.o alloc.o -lm
mpicc -O3 -Wall -g -fopenmp -o diffbin diffbin.c -lm
mpicc -O3 -Wall -g -fopenmp -o diffbin_ext diffbin_ext.c -lm
mpicc -c -O3 -Wall -g -fopenmp colcopy.c
mpicc -O3 -Wall -g -fopenmp -o colcopy colcopy.o alloc.o
mpicc -c -O3 -Wall -g -fopenmp pingpong.c
mpicc -O3 -Wall -g -fopenmp -o pingpong pingpong.o
[u5718324@kudu-taught karman]$ export OMP_NUM_THREADS=1
[u5718324@kudu-taught karman]$ ./karman
Simulation complete.
Elapsed time: 23.3595 sec 
[u5718324@kudu-taught karman]$ cp karman.bin serial_start.bin
[u5718324@kudu-taught karman]$ cp karman.bin serial_parallel.bin 
[u5718324@kudu-taught karman]$ cp serial_start.bin karman.bin
[u5718324@kudu-taught karman]$ export OMP_NUM_THREADS=1
[u5718324@kudu-taught karman]$ ./karman
Simulation complete.
Elapsed time: 23.0743 sec 
[u5718324@kudu-taught karman]$ mv karman.bin serial_result.bin
[u5718324@kudu-taught karman]$ make clean
rm -f bin2ppm diffbin diffbin_ext pingpong colcopy karman karman-par *.o
[u5718324@kudu-taught karman]$ make CC=mpicc
mpicc -c -O3 -Wall -g -fopenmp alloc.c
mpicc -c -O3 -Wall -g -fopenmp boundary.c
mpicc -c -O3 -Wall -g -fopenmp init.c
mpicc -c -O3 -Wall -g -fopenmp karman.c
mpicc -c -O3 -Wall -g -fopenmp simulation.c
mpicc -O3 -Wall -g -fopenmp -o karman alloc.o boundary.o init.o karman.o simulation.o -lm
mpicc -c -O3 -Wall -g -fopenmp bin2ppm.c
mpicc -O3 -Wall -g -fopenmp -o bin2ppm bin2ppm.o alloc.o -lm
mpicc -O3 -Wall -g -fopenmp -o diffbin diffbin.c -lm
mpicc -O3 -Wall -g -fopenmp -o diffbin_ext diffbin_ext.c -lm
mpicc -c -O3 -Wall -g -fopenmp colcopy.c
mpicc -O3 -Wall -g -fopenmp -o colcopy colcopy.o alloc.o
mpicc -c -O3 -Wall -g -fopenmp pingpong.c
mpicc -O3 -Wall -g -fopenmp -o pingpong pingpong.o
[u5718324@kudu-taught karman]$ cp serial_parallel.bin karman.bin
[u5718324@kudu-taught karman]$ export OMP_NUM_THREADS=4
[u5718324@kudu-taught karman]$ ./karman
Simulation complete.
Elapsed time: 22.5278 sec 
[u5718324@kudu-taught karman]$ mv karman.bin parallen_result.bin
[u5718324@kudu-taught karman]$ ./diffbin serial_result.bin parallen_result.bin
Files identical.