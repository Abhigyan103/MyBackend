-- CreateTable
CREATE TABLE "ShortUrls" (
    "shortenedUrl" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShortUrls_pkey" PRIMARY KEY ("shortenedUrl")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortUrls_originalUrl_key" ON "ShortUrls"("originalUrl");
