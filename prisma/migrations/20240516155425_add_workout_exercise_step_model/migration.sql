-- CreateTable
CREATE TABLE "WorkoutExerciseStep" (
    "id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "workoutId" TEXT NOT NULL,

    CONSTRAINT "WorkoutExerciseStep_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkoutExerciseStep" ADD CONSTRAINT "WorkoutExerciseStep_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
