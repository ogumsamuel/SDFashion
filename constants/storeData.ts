// storeData.ts — local product data
// localImageId is used to match Firestore products to local images
// when Supabase is introduced in Week 14, this file will be retired

export type Product = {
  id:           string;
  title:        string;
  price:        string;
  description:  string;
  image:        any;
};

export const STORE_DATA: Product[] = [
  {
    id: '1',
    title: 'Vintage Denim Jacket',
    price: '$45.00',
    description: 'High-quality vintage denim with a classic cut. Perfect for any season.',
    image: { uri: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000' },
  },
  {
    id: '2',
    title: 'Classic White Sneakers',
    price: '$89.99',
    description: 'Clean, minimalist design that pairs perfectly with any outfit.',
    image: { uri: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500' },
  },
  {
    id: '3',
    title: 'Minimalist Watch',
    price: '$120.00',
    description: 'Sleek dark face with a comfortable, durable leather band.',
    image: { uri: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500' },
  },
   {
    id: '4',
    title: "Assorted Color Shirts",
    price: '$220.00',
    description:  "Beautiful unisex crew neck polo shirts",
    image: require("../assets/images/assortedcolorshirt.jpg")
  },
    {
    id: "5",
    title: "Black and Grey Checkered Dress Shirt",
    price: "$140.00",
    description: "The Black and Grey Long Sleeve Shirt is a stylish blend of simplicity and class",
    image: require("../assets/images/blackandgrey.jpg")
   },
     {
    id: "6",
    title: "Blue Crew-neck Tops",
    price: "$32.90",
    description: "A unisex crew neck polo",
    image: require("../assets/images/bluecrewnecktops.jpg")
   },
   {
    id: "7",
    title: "Blue Denim Button Up Jacket",
    price: "$204.66",
    description: "lightweight denim jacket, durable, comfortable and ideal for spring, fall, and cool-weather",
    image: require("../assets/images/bluejacket.jpg")
   },
    {
    id: "8",
    title: "Blue and Pink Floral Almond Toe Pumps",
    price: "$135.00",
    description: "Almond-shaped toe shoe is a timeless footwear design rounded front that combines the elegance of pointed",
    image: require("../assets/images/bluenpinkheels.jpg")
   },
    {
    id: "9",
    title: "Brown Leather Belt Silver Buckle",
    price: "$80.30",
    description: "Suitable for business, office, and casual attire",
    image: require("../assets/images/brownbelt.jpg")
   },
   {
    id: "10",
    title: "Green and Black Nike Athletic Shoe",
    price: "$500.50",
    description: "A comfortable cushioning with a Zoom Air unit Nike shoe",
    image: require("../assets/images/greennblacknike.jpg")
   },
     {
    id: "11",
    title: "Grey Knit Sweater",
    price: "$25.70",
    description: "A very comfortable for the cold weather",
    image: require("../assets/images/greyknitsweater.jpg")
   },
   {
    id: "12",
    title: "Crew Grey Shirt",
    price: "$90.20",
    description: "High-quality cotton that gives you comfort",
    image: require("../assets/images/greyshirt.jpg")
   },
   {
    id: "13",
    title: "Orange Knit Cap",
    price: "$30.50",
    description: "A winter essential, bold fashion statement that combines warmth, comfort, and vibrant style",
    image: require("../assets/images/orangecap.jpg")
   },
   {
    id: "14",
    title: "Red Nike Sneaker",
    price: "$90.60",
    description: "Pressurized air units providing lightweight, responsive cushioning",
    image: require("../assets/images/rednike.jpg")
   },
   {
    id: "15",
    title: "White V Neck Shirt",
    price: "$50.00",
    description: "Crafted from soft cotton or breathable blends",
    image: require("../assets/images/vneckshirt.jpg")
   },

];

// Helper — look up local image by localImageId from Firestore
export function getLocalImage(localImageId: string): any {
  const product = STORE_DATA.find((p) => p.id === localImageId);
  return product?.image ?? { uri: 'https://via.placeholder.com/300' };
}
