/*
  Warnings:

  - Added the required column `name` to the `ExerciseMuscleTarget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `side` to the `ExerciseMuscleTarget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExerciseMuscleTarget" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "side" TEXT NOT NULL;
