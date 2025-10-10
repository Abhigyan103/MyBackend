// export const createShortUrl = async (
//   originalUrl: string,
//   shortenedUrl: string
// ): Promise<PrismaTypes.ShortUrls> => {
//   // Simulate a database call to create a short URL
//   const newShortUrl = prismaClient.shortUrls.create({
//     data: {
//       originalUrl,
//       shortenedUrl,
//     },
//   });
//   return newShortUrl;
// };

// export const getOriginalUrl = async (
//   shortenedUrl: string
// ): Promise<PrismaTypes.ShortUrls | null> => {
//   // Simulate a database call to get original URL by shortened URL
//   const shortUrl = await prismaClient.shortUrls.findUnique({
//     where: { shortenedUrl },
//   });
//   return shortUrl;
// };
