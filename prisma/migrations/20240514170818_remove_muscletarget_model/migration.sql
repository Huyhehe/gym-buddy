/*
  Warnings:

  - You are about to drop the column `muscleTargetId` on the `ExerciseMuscleTarget` table. All the data in the column will be lost.
  - You are about to drop the `MuscleTarget` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExerciseMuscleTarget" DROP CONSTRAINT "ExerciseMuscleTarget_muscleTargetId_fkey";

-- AlterTable
ALTER TABLE "ExerciseMuscleTarget" DROP COLUMN "muscleTargetId",
ADD COLUMN     "affectLevel" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "MuscleTarget";
