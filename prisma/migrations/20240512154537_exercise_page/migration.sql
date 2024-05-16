-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "mechanic" TEXT NOT NULL DEFAULT 'compound',
    "force" TEXT,
    "workoutId" TEXT,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseStep" (
    "id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,

    CONSTRAINT "ExerciseStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseExample" (
    "id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "mediaURL" TEXT NOT NULL,
    "gender" BOOLEAN NOT NULL,
    "exerciseId" TEXT NOT NULL,

    CONSTRAINT "ExerciseExample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuscleTarget" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MuscleTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseMuscleTarget" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "muscleTargetId" TEXT NOT NULL,

    CONSTRAINT "ExerciseMuscleTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "target" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseStep" ADD CONSTRAINT "ExerciseStep_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseExample" ADD CONSTRAINT "ExerciseExample_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseMuscleTarget" ADD CONSTRAINT "ExerciseMuscleTarget_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseMuscleTarget" ADD CONSTRAINT "ExerciseMuscleTarget_muscleTargetId_fkey" FOREIGN KEY ("muscleTargetId") REFERENCES "MuscleTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
