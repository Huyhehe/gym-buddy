/*
  Warnings:

  - You are about to drop the column `exerciseEquipmentId` on the `Exercise` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_exerciseEquipmentId_fkey";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "exerciseEquipmentId";
