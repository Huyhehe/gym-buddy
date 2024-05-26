/*
  Warnings:

  - Changed the type of `difficulty` on the `Exercise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" INTEGER NOT NULL;
