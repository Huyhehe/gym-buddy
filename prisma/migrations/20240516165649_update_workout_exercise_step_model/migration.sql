/*
  Warnings:

  - Added the required column `exerciseId` to the `WorkoutExerciseStep` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkoutExerciseStep" ADD COLUMN     "exerciseId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkoutExerciseStep" ADD CONSTRAINT "WorkoutExerciseStep_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
