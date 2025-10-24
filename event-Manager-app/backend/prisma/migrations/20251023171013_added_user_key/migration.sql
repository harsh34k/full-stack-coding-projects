/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,userKey]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userKey` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "userKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Event_title_key" ON "public"."Event"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Event_title_userKey_key" ON "public"."Event"("title", "userKey");
