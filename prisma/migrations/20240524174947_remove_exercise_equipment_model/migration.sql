/*
  Warnings:

  - You are about to drop the `ExerciseEquipment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `equipment` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExerciseEquipment" DROP CONSTRAINT "ExerciseEquipment_equipmentId_fkey";

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "equipment" TEXT NOT NULL;

-- DropTable
DROP TABLE "ExerciseEquipment";
