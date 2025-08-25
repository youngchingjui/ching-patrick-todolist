-- AlterTable: add updatedById to Todo and FK to User
ALTER TABLE "public"."Todo" ADD COLUMN "updatedById" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Todo" ADD CONSTRAINT "Todo_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
