/*
  Warnings:

  - You are about to drop the column `category` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `coverImage` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `visibility` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "category",
DROP COLUMN "color",
DROP COLUMN "coverImage",
DROP COLUMN "visibility";
