/*
  Warnings:

  - Added the required column `exerciseEquipmentId` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "exerciseEquipmentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_exerciseEquipmentId_fkey" FOREIGN KEY ("exerciseEquipmentId") REFERENCES "ExerciseEquipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
