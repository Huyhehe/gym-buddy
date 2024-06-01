/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createdById_fkey";

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "caloriesBurned" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "caloriesNeed" INTEGER,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "trainingGoal" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "UserWorkout" ADD COLUMN     "trainingTimes" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Post";
