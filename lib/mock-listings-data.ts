import { Listing } from "./listings-service"
import { Car, Home, Wrench, Music, Shirt, Laptop, Dumbbell } from "lucide-react"

// Generate comprehensive listings with 20+ items per category
export const generateMockListings = (): Listing[] => {
  const categories = [
    { id: "vehicles", name: "Vehicles", icon: Car },
    { id: "homes", name: "Homes & Apartments", icon: Home },
    { id: "equipment", name: "Equipment & Tools", icon: Wrench },
    { id: "events", name: "Event Spaces & Venues", icon: Music },
    { id: "fashion", name: "Fashion & Lifestyle", icon: Shirt },
    { id: "tech", name: "Tech & Gadgets", icon: Laptop },
    { id: "sports", name: "Sports & Recreation", icon: Dumbbell }
  ]

  const vehicleTitles = [
    "Luxury BMW X5 SUV", "Honda CB650R Motorbike", "Toyota Land Cruiser", "Mercedes-Benz C-Class",
    "Nissan Navara Pickup", "Kawasaki Ninja 650", "Volkswagen Golf", "Ford Ranger",
    "Suzuki Swift", "Hyundai Tucson", "Mazda CX-5", "Subaru Outback",
    "Audi A4", "BMW 3 Series", "Lexus RX", "Infiniti Q50",
    "Chevrolet Equinox", "Jeep Wrangler", "Land Rover Discovery", "Porsche Cayenne"
  ]

  const homeTitles = [
    "Modern 2-Bedroom Apartment", "Luxury Holiday Villa in Karen", "Studio Apartment Westlands",
    "3-Bedroom House Runda", "Penthouse Kilimani", "Serviced Apartment CBD",
    "Executive Suite Karen", "Townhouse Lavington", "Duplex Westlands", "Garden Apartment Kileleshwa",
    "Penthouse Riverside", "Villa Muthaiga", "Apartment Complex Thika Road", "House Karen",
    "Studio CBD", "2-Bedroom Lavington", "3-Bedroom Runda", "Penthouse Kilimani",
    "Villa Karen", "Apartment Westlands"
  ]

  const equipmentTitles = [
    "Professional Camera Kit", "Construction Tools Package", "Sound System Setup",
    "Drone Photography Kit", "Welding Equipment", "Power Tools Set", "Audio Mixing Board",
    "Lighting Equipment", "Generator Set", "Excavator Rental", "Crane Equipment",
    "Concrete Mixer", "Scaffolding Set", "Safety Equipment", "Measuring Tools",
    "Cutting Tools", "Drilling Equipment", "Painting Equipment", "Cleaning Equipment",
    "Office Equipment"
  ]

  const eventTitles = [
    "Elegant Wedding Hall", "Conference Center", "Outdoor Event Space", "Banquet Hall",
    "Garden Venue", "Rooftop Terrace", "Beach Venue", "Museum Venue", "Gallery Space",
    "Theater Hall", "Sports Complex", "Community Center", "Hotel Conference Room",
    "Restaurant Private Room", "Wine Bar Venue", "Cultural Center", "Exhibition Hall",
    "Convention Center", "Auditorium", "Chapel Venue"
  ]

  const fashionTitles = [
    "Designer Evening Gown", "Designer Handbag Collection", "Luxury Watch Collection",
    "Designer Shoes", "Jewelry Set", "Cocktail Dress", "Business Suit", "Wedding Dress",
    "Designer Jacket", "Luxury Scarf", "Designer Belt", "Evening Wear Set",
    "Formal Attire", "Designer Accessories", "Luxury Perfume", "Designer Sunglasses",
    "Fashion Jewelry", "Designer Hat", "Luxury Handbag", "Designer Coat"
  ]

  const techTitles = [
    "MacBook Pro M2", "Gaming Console Setup", "iPhone 15 Pro", "Samsung Galaxy S24",
    "iPad Pro", "Dell XPS Laptop", "HP Pavilion", "Lenovo ThinkPad", "ASUS ROG Gaming Laptop",
    "Microsoft Surface", "Apple Watch", "Samsung Galaxy Watch", "AirPods Pro",
    "Sony WH-1000XM5", "DJI Mavic Drone", "GoPro Hero", "Nintendo Switch",
    "PlayStation 5", "Xbox Series X", "VR Headset"
  ]

  const sportsTitles = [
    "Mountain Bike Package", "Professional Piano", "Treadmill", "Weight Bench Set",
    "Tennis Racket Set", "Golf Clubs", "Swimming Pool", "Basketball Court",
    "Football Equipment", "Cricket Set", "Badminton Set", "Table Tennis Set",
    "Yoga Mat Set", "Dumbbell Set", "Resistance Bands", "Elliptical Machine",
    "Rowing Machine", "Exercise Bike", "Boxing Equipment", "Skateboard"
  ]

  const locations = ["Nairobi, Kenya", "Mombasa, Kenya", "Kisumu, Kenya", "Nakuru, Kenya", "Eldoret, Kenya"]
  const owners = [
    { id: "owner1", name: "John Mwangi", rating: 4.9, verified: true },
    { id: "owner2", name: "Sarah Kimani", rating: 4.8, verified: true },
    { id: "owner3", name: "David Ochieng", rating: 4.7, verified: true },
    { id: "owner4", name: "Mary Njeri", rating: 4.9, verified: true },
    { id: "owner5", name: "Peter Kamau", rating: 4.6, verified: true },
    { id: "owner6", name: "Grace Wanjiku", rating: 4.8, verified: true },
    { id: "owner7", name: "Kevin Otieno", rating: 4.7, verified: true },
    { id: "owner8", name: "James Mutua", rating: 4.9, verified: true }
  ]

  const images = [
    "/images/Luxury Sports Car.jpg", "/luxury-cars-in-modern-showroom.jpg", "/modern-apartment-city-view.png",
    "/images/Vintage Camera Collection.jpg", "/professional-construction-and-industrial-equipment.jpg",
    "/elegant-event-venue-with-chandeliers-and-tables.jpg", "/designer-clothing-and-fashion-accessories.jpg",
    "/modern-electronics-and-tech-gadgets-display.jpg", "/images/Gaming Setup.jpg", "/images/Mountain Bike.jpg"
  ]

  const listings: Listing[] = []
  let id = 1

  categories.forEach(category => {
    let titles: string[] = []
    let amenities: string[] = []
    let basePrice = 5000

    switch (category.id) {
      case "vehicles":
        titles = vehicleTitles
        amenities = ["GPS Navigation", "Bluetooth", "Air Conditioning", "Insurance"]
        basePrice = 8000
        break
      case "homes":
        titles = homeTitles
        amenities = ["WiFi", "Parking", "Security", "Furnished"]
        basePrice = 15000
        break
      case "equipment":
        titles = equipmentTitles
        amenities = ["Professional Grade", "Maintenance Included", "Delivery Available", "Training Provided"]
        basePrice = 3000
        break
      case "events":
        titles = eventTitles
        amenities = ["Sound System", "Lighting", "Tables", "Chairs"]
        basePrice = 20000
        break
      case "fashion":
        titles = fashionTitles
        amenities = ["Authentic", "Dry Cleaned", "Size Available", "Accessories Included"]
        basePrice = 2000
        break
      case "tech":
        titles = techTitles
        amenities = ["Warranty", "Charger Included", "Case Included", "Setup Support"]
        basePrice = 4000
        break
      case "sports":
        titles = sportsTitles
        amenities = ["Equipment Included", "Safety Gear", "Maintenance", "Delivery Available"]
        basePrice = 3000
        break
    }

    titles.forEach((title, index) => {
      const owner = owners[index % owners.length]
      const image = images[index % images.length]
      const price = basePrice + (Math.random() * 10000)
      const rating = 4.0 + (Math.random() * 1.0)
      const reviews = Math.floor(Math.random() * 200) + 10
      const createdAt = new Date(2024, 0, Math.floor(Math.random() * 30) + 1)

      listings.push({
        id: id.toString(),
        title,
        description: `High-quality ${category.name.toLowerCase()} perfect for your needs`,
        price: Math.round(price),
        location: locations[index % locations.length],
        rating: Math.round(rating * 10) / 10,
        reviews,
        image,
        amenities,
        available: true,
        category: category.id,
        owner: { ...owner, avatar: "/placeholder-user.jpg" },
        images: [image],
        fullDescription: `Premium ${title.toLowerCase()} with all modern amenities and professional service. Perfect for your specific needs with excellent customer support.`,
        createdAt,
        updatedAt: createdAt
      })
      id++
    })
  })

  return listings
}

export const mockListings: Listing[] = generateMockListings()
