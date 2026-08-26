package com.overnight.OverNight.seed;

import com.overnight.OverNight.domain.*;
import com.overnight.OverNight.infrastructure.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CityRepo cityRepository;
    private final HotelRepo hotelRepository;
    private final HotelChainRepo hotelChainRepository;
    private final HotelAmenityRepo hotelAmenityRepository;
    private final RoomRepo roomRepository;
    private final RoomTypeRepo roomTypeRepository;
    private final RoomAmenityRepo roomAmenityRepository;
    private final UserRepo userRepository;
    private final StaffRepo staffRepository;
    private final ReservationRepo reservationRepository;
    private final PaymentRepo paymentRepository;
    private final ReceiptRepo receiptRepository;
    private final RoomPolicyRepo roomPolicyRepository;
    private final ServiceRepo serviceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (cityRepository.count() > 0) {
            System.out.println("✅ Database already seeded. Skipping...");
            return;
        }

        System.out.println("🌱 Starting database seeding...");

        // 1. Create Cities
        List<City> cities = createCities();
        cityRepository.saveAll(cities);

        // 2. Create Hotel Chains
        List<HotelChain> hotelChains = createHotelChains();
        hotelChainRepository.saveAll(hotelChains);

        // 3. Create Hotel Amenities
        List<HotelAmenity> hotelAmenities = createHotelAmenities();
        hotelAmenityRepository.saveAll(hotelAmenities);

        // 4. Create Room Amenities
        List<RoomAmenity> roomAmenities = createRoomAmenities();
        roomAmenityRepository.saveAll(roomAmenities);

        // 5. Create Hotels (linked to chains and cities)
        List<Hotel> hotels = createHotels(cities, hotelChains, hotelAmenities);
        hotelRepository.saveAll(hotels);

        // 6. Create Room Types
        List<RoomType> roomTypes = createRoomTypes(hotels);
        roomTypeRepository.saveAll(roomTypes);

        // 7. Create Rooms (linked to hotels)
        List<Room> rooms = createRooms(hotels, roomTypes, roomAmenities);
        roomRepository.saveAll(rooms);

        // 8. Update hotel counts for chains
        updateHotelChainCounts(hotelChains, hotels);

        // 9. Create Room Policies
        List<RoomPolicy> policies = createRoomPolicies(hotels);
        roomPolicyRepository.saveAll(policies);

        // 10. Create Services
        List<Service> services = createServices(hotels);
        serviceRepository.saveAll(services);

        // 11. Create Users
        List<User> users = createUsers();
        userRepository.saveAll(users);

        // 12. Create Staff
        List<Staff> staff = createStaff();
        staffRepository.saveAll(staff);

        // 13. Create Reservations
        List<Reservation> reservations = createReservations(users, rooms);
        reservationRepository.saveAll(reservations);

        // 14. Create Payments
        List<Payment> payments = createPayments(reservations, users);
        paymentRepository.saveAll(payments);

        // 15. Create Receipts
        List<Receipt> receipts = createReceipts(payments, reservations, users);
        receiptRepository.saveAll(receipts);

        System.out.println("✅ Database seeding completed successfully!");
        System.out.println("📊 Summary:");
        System.out.println("   - Cities: " + cities.size());
        System.out.println("   - Hotel Chains: " + hotelChains.size());
        System.out.println("   - Hotels: " + hotels.size());
        System.out.println("   - Rooms: " + rooms.size());
        System.out.println("   - Users: " + users.size());
        System.out.println("   - Staff: " + staff.size());
        System.out.println("   - Reservations: " + reservations.size());
    }

    private List<City> createCities() {
        return Arrays.asList(
                createCity("Toronto", "Canada"),
                createCity("Vancouver", "Canada"),
                createCity("Montreal", "Canada"),
                createCity("New York", "USA"),
                createCity("Los Angeles", "USA"),
                createCity("Chicago", "USA"),
                createCity("London", "UK"),
                createCity("Paris", "France"),
                createCity("Tokyo", "Japan"),
                createCity("Sydney", "Australia")
        );
    }

    private City createCity(String name, String country) {
        City city = new City();
        city.setName(name);
        city.setCountry(country);
        city.setIsActive(true);
        return city;
    }

    private List<HotelChain> createHotelChains() {
        return Arrays.asList(
                createHotelChain("Marriott International", "Global hospitality leader with premium hotels worldwide."),
                createHotelChain("Hilton Worldwide", "World-class hospitality with a legacy of excellence."),
                createHotelChain("Accor Hotels", "European hospitality leader with diverse brand portfolio."),
                createHotelChain("InterContinental Hotels Group", "Global hotel chain with luxury and premium brands."),
                createHotelChain("Hyatt Hotels Corporation", "Premium hospitality with focus on luxury and lifestyle.")
        );
    }

    private HotelChain createHotelChain(String name, String description) {
        HotelChain chain = new HotelChain();
        chain.setName(name);
        chain.setDescription(description);
        chain.setIsActive(true);
        chain.setHotelCount(0);
        return chain;
    }

    private List<HotelAmenity> createHotelAmenities() {
        return Arrays.asList(
                createHotelAmenity("Free Wi-Fi", "High-speed internet access throughout the hotel"),
                createHotelAmenity("Swimming Pool", "Outdoor heated swimming pool"),
                createHotelAmenity("Fitness Center", "State-of-the-art gym facilities"),
                createHotelAmenity("Spa & Wellness", "Full-service spa with massage and treatments"),
                createHotelAmenity("Restaurant", "On-site restaurant with gourmet dining"),
                createHotelAmenity("Bar/Lounge", "Elegant bar with signature cocktails"),
                createHotelAmenity("Business Center", "Fully-equipped business facilities"),
                createHotelAmenity("Parking", "Secure on-site parking available"),
                createHotelAmenity("Room Service", "24-hour in-room dining service"),
                createHotelAmenity("Concierge", "Professional concierge service")
        );
    }

    private HotelAmenity createHotelAmenity(String name, String description) {
        HotelAmenity amenity = new HotelAmenity();
        amenity.setName(name);
        amenity.setDescription(description);
        amenity.setIsActive(true);
        return amenity;
    }

    private List<RoomAmenity> createRoomAmenities() {
        return Arrays.asList(
                createRoomAmenity("Air Conditioning", "Individual climate control"),
                createRoomAmenity("Flat-screen TV", "55-inch smart TV with streaming"),
                createRoomAmenity("Mini Bar", "Stocked mini bar with refreshments"),
                createRoomAmenity("Coffee Maker", "Premium coffee maker with complimentary coffee"),
                createRoomAmenity("Work Desk", "Ergonomic work desk with chair"),
                createRoomAmenity("Safe", "Electronic in-room safe"),
                createRoomAmenity("Hair Dryer", "Professional hair dryer"),
                createRoomAmenity("Iron/Ironing Board", "Full-size iron and board"),
                createRoomAmenity("Wi-Fi", "High-speed wireless internet"),
                createRoomAmenity("Balcony", "Private balcony with city view")
        );
    }

    private RoomAmenity createRoomAmenity(String name, String description) {
        RoomAmenity amenity = new RoomAmenity();
        amenity.setName(name);
        amenity.setDescription(description);
        amenity.setIsActive(true);
        return amenity;
    }

    private List<Hotel> createHotels(List<City> cities, List<HotelChain> chains, List<HotelAmenity> amenities) {
        List<Hotel> hotels = new ArrayList<>();

        // Marriott Hotels (Chain 0)
        hotels.add(createHotel("Toronto Marriott Downtown", cities.get(0), chains.get(0),
                "110 Queen St W, Toronto, ON", "info.toronto@marriott.com", 4,
                Arrays.asList(amenities.get(0), amenities.get(1), amenities.get(4), amenities.get(7))));
        hotels.add(createHotel("Marriott Vancouver", cities.get(1), chains.get(0),
                "1128 W Georgia St, Vancouver, BC", "vancouver@marriott.com", 5,
                Arrays.asList(amenities.get(0), amenities.get(2), amenities.get(4), amenities.get(8))));
        hotels.add(createHotel("Marriott Chicago", cities.get(5), chains.get(0),
                "540 N Michigan Ave, Chicago, IL", "chicago@marriott.com", 4,
                Arrays.asList(amenities.get(0), amenities.get(1), amenities.get(3), amenities.get(6))));
        hotels.add(createHotel("Marriott Sydney", cities.get(9), chains.get(0),
                "161 Sussex St, Sydney, Australia", "sydney@marriott.com", 5,
                Arrays.asList(amenities.get(0), amenities.get(2), amenities.get(5), amenities.get(9))));
        hotels.add(createHotel("Marriott London", cities.get(6), chains.get(0),
                "14 Park Lane, London, UK", "london@marriott.com", 5,
                Arrays.asList(amenities.get(0), amenities.get(4), amenities.get(6), amenities.get(7))));

        // Hilton Hotels (Chain 1)
        hotels.add(createHotel("Hilton Vancouver", cities.get(1), chains.get(1),
                "433 Robson St, Vancouver, BC", "vancouver@hilton.com", 5,
                Arrays.asList(amenities.get(0), amenities.get(1), amenities.get(4), amenities.get(8))));
        hotels.add(createHotel("Hilton London", cities.get(6), chains.get(1),
                "22 Park Lane, London, UK", "london@hilton.com", 5,
                Arrays.asList(amenities.get(0), amenities.get(2), amenities.get(5), amenities.get(7))));
        hotels.add(createHotel("Hilton New York", cities.get(3), chains.get(1),
                "1335 6th Ave, New York, NY", "ny@hilton.com", 4,
                Arrays.asList(amenities.get(0), amenities.get(4), amenities.get(6), amenities.get(9))));
        hotels.add(createHotel("Hilton Paris", cities.get(7), chains.get(1),
                "18 Rue de Rivoli, Paris, France", "paris@hilton.com", 5,
                Arrays.asList(amenities.get(0), amenities.get(1), amenities.get(3), amenities.get(8))));
        hotels.add(createHotel("Hilton Tokyo", cities.get(8), chains.get(1),
                "2-7-2 Nishi-Shinjuku, Tokyo, Japan", "tokyo@hilton.com", 4,
                Arrays.asList(amenities.get(0), amenities.get(2), amenities.get(5), amenities.get(7))));

        // Accor Hotels (Chain 2)
        hotels.add(createHotel("Accor Le Mont-Royal", cities.get(2), chains.get(2),
                "1230 Rue de la Montagne, Montreal, QC", "montreal@accor.com", 4,
                Arrays.asList(amenities.get(0), amenities.get(4), amenities.get(6), amenities.get(8))));
        hotels.add(createHotel("Accor Paris", cities.get(7), chains.get(2),
                "40 Rue de Rivoli, Paris, France", "paris@accor.com", 4,
                Arrays.asList(amenities.get(0), amenities.get(1), amenities.get(3), amenities.get(7))));
        hotels.add(createHotel("Accor Los Angeles", cities.get(4), chains.get(2),
                "711 S Hope St, Los Angeles, CA", "la@accor.com", 4,
                Arrays.asList(amenities.get(0), amenities.get(2), amenities.get(5), amenities.get(9))));
        hotels.add(createHotel("Accor Berlin", cities.get(0), chains.get(2),
                "125 Queen St W, Toronto, ON", "berlin@accor.com", 4,
                Arrays.asList(amenities.get(0), amenities.get(4), amenities.get(6), amenities.get(8))));

        // InterContinental Hotels (Chain 3)
        hotels.add(createHotel("The Plaza Hotel", cities.get(3), chains.get(3),
                "768 5th Ave, New York, NY", "plaza@ihg.com", 5,
                Arrays.asList(amenities.get(0), amenities.get(1), amenities.get(4), amenities.get(7), amenities.get(9))));
        hotels.add(createHotel("InterContinental London", cities.get(6), chains.get(3),
                "1 Hamilton Place, London, UK", "london@ihg.com", 5,
                Arrays.asList(amenities.get(0), amenities.get(2), amenities.get(5), amenities.get(8))));
        hotels.add(createHotel("InterContinental Chicago", cities.get(5), chains.get(3),
                "505 N Michigan Ave, Chicago, IL", "chicago@ihg.com", 4,
                Arrays.asList(amenities.get(0), amenities.get(4), amenities.get(6), amenities.get(7))));
        hotels.add(createHotel("InterContinental Tokyo", cities.get(8), chains.get(3),
                "2-7-2 Nishi-Shinjuku, Tokyo, Japan", "tokyo@ihg.com", 5,
                Arrays.asList(amenities.get(0), amenities.get(1), amenities.get(3), amenities.get(9))));

        // Hyatt Hotels (Chain 4)
        hotels.add(createHotel("Hyatt Regency LA", cities.get(4), chains.get(4),
                "711 S Hope St, Los Angeles, CA", "la@hyatt.com", 4,
                Arrays.asList(amenities.get(0), amenities.get(2), amenities.get(4), amenities.get(7))));
        hotels.add(createHotel("Hyatt Tokyo", cities.get(8), chains.get(4),
                "2-7-2 Nishi-Shinjuku, Tokyo, Japan", "tokyo@hyatt.com", 4,
                Arrays.asList(amenities.get(0), amenities.get(1), amenities.get(5), amenities.get(8))));
        hotels.add(createHotel("Hyatt Vancouver", cities.get(1), chains.get(4),
                "655 Burrard St, Vancouver, BC", "vancouver@hyatt.com", 5,
                Arrays.asList(amenities.get(0), amenities.get(3), amenities.get(6), amenities.get(9))));
        hotels.add(createHotel("Hyatt Sydney", cities.get(9), chains.get(4),
                "161 Sussex St, Sydney, Australia", "sydney@hyatt.com", 5,
                Arrays.asList(amenities.get(0), amenities.get(2), amenities.get(4), amenities.get(7))));

        return hotels;
    }

    private Hotel createHotel(String name, City city, HotelChain chain, String address,
                              String email, int rating, List<HotelAmenity> amenities) {
        Hotel hotel = new Hotel();
        hotel.setName(name);
        hotel.setCity(city);
        hotel.setHotelChain(chain);
        hotel.setAddress(address);
        hotel.setEmail(email);
        hotel.setRating(rating);
        hotel.setCheckIn("15:00");
        hotel.setCheckOut("11:00");
        hotel.setDescription("Luxurious " + rating + "-star hotel in the heart of " + city.getName() +
                ", offering premium amenities and exceptional service.");
        hotel.setIsActive(true);
        hotel.setImageUrl("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80");
        hotel.setHotelAmenities(amenities);
        return hotel;
    }

    private void updateHotelChainCounts(List<HotelChain> chains, List<Hotel> hotels) {
        for (HotelChain chain : chains) {
            long count = hotels.stream()
                    .filter(h -> h.getHotelChain() != null &&
                            h.getHotelChain().getId().equals(chain.getId()))
                    .count();
            chain.setHotelCount((int) count);
            hotelChainRepository.save(chain);
            System.out.println("   - " + chain.getName() + ": " + count + " hotels");
        }
    }

    private List<RoomType> createRoomTypes(List<Hotel> hotels) {
        List<RoomType> roomTypes = new ArrayList<>();

        for (Hotel hotel : hotels) {
            roomTypes.add(createRoomType(hotel, "Standard", "Comfortable room with essential amenities", 150.0, 2));
            roomTypes.add(createRoomType(hotel, "Deluxe", "Spacious room with premium amenities", 250.0, 4));
            roomTypes.add(createRoomType(hotel, "Suite", "Luxurious suite with separate living area", 400.0, 4));
            roomTypes.add(createRoomType(hotel, "Family", "Large room perfect for families", 300.0, 6));
        }
        return roomTypes;
    }

    private RoomType createRoomType(Hotel hotel, String name, String description, Double basePrice, Integer maxOccupancy) {
        RoomType roomType = new RoomType();
        roomType.setHotel(hotel);
        roomType.setName(name);
        roomType.setDescription(description);
        roomType.setBasePrice(basePrice);
        roomType.setMaxOccupancy(maxOccupancy);
        roomType.setIsActive(true);
        return roomType;
    }

    private List<Room> createRooms(List<Hotel> hotels, List<RoomType> roomTypes, List<RoomAmenity> amenities) {
        List<Room> rooms = new ArrayList<>();
        int roomCounter = 1;

        for (int i = 0; i < hotels.size(); i++) {
            Hotel hotel = hotels.get(i);
            // Get room types for this hotel (4 types per hotel)
            int startIdx = i * 4;
            int endIdx = startIdx + 4;
            List<RoomType> hotelRoomTypes = roomTypes.subList(startIdx, endIdx);

            for (RoomType roomType : hotelRoomTypes) {
                for (int j = 1; j <= 3; j++) {
                    String roomNumber = String.format("%03d", roomCounter++);
                    Room room = new Room();
                    room.setHotel(hotel);
                    room.setRoomNumber(roomNumber);
                    room.setRoomType(roomType);
                    room.setPrice(roomType.getBasePrice() + (j * 10));
                    room.setCapacity(roomType.getMaxOccupancy());
                    room.setIsExtendable(j % 2 == 0);
                    room.setConditionNote("Recently renovated, excellent condition");
                    room.setIsActive(true);
                    room.setImageUrl("https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80");

                    // Add random amenities
                    if (j == 1) {
                        room.setRoomAmenities(amenities.subList(0, 4));
                    } else if (j == 2) {
                        room.setRoomAmenities(amenities.subList(2, 7));
                    } else {
                        room.setRoomAmenities(amenities.subList(4, 9));
                    }

                    rooms.add(room);
                }
            }
        }
        return rooms;
    }

    private List<RoomPolicy> createRoomPolicies(List<Hotel> hotels) {
        List<RoomPolicy> policies = new ArrayList<>();

        for (Hotel hotel : hotels) {
            policies.addAll(Arrays.asList(
                    createRoomPolicy(hotel, "CHECK_IN", "Check-in Time", "Check-in from 3:00 PM. Early check-in available upon request.", 1),
                    createRoomPolicy(hotel, "CHECK_OUT", "Check-out Time", "Check-out by 11:00 AM. Late check-out available for a fee.", 2),
                    createRoomPolicy(hotel, "CANCELLATION", "Cancellation Policy", "Free cancellation up to 24 hours before check-in. Full charge for no-show.", 3),
                    createRoomPolicy(hotel, "PETS", "Pet Policy", "Pets allowed with additional cleaning fee. Maximum 2 pets per room.", 4),
                    createRoomPolicy(hotel, "SMOKING", "Smoking Policy", "Smoking is prohibited in all rooms. Designated smoking areas available outside.", 5)
            ));
        }
        return policies;
    }

    private RoomPolicy createRoomPolicy(Hotel hotel, String type, String title, String description, int order) {
        RoomPolicy policy = new RoomPolicy();
        policy.setHotel(hotel);
        policy.setPolicyType(type);
        policy.setTitle(title);
        policy.setDescription(description);
        policy.setDisplayOrder(order);
        policy.setIsActive(true);
        return policy;
    }

    private List<Service> createServices(List<Hotel> hotels) {
        List<Service> services = new ArrayList<>();
        List<String> serviceDescriptions = Arrays.asList(
                "24-hour front desk service with multilingual staff",
                "Daily housekeeping and turndown service",
                "Airport shuttle service available for a fee",
                "Valet parking service available",
                "Dry cleaning and laundry service",
                "Wake-up call service available upon request",
                "Babysitting services available with advance notice",
                "Grocery delivery service to your room"
        );

        for (Hotel hotel : hotels) {
            for (int i = 0; i < serviceDescriptions.size(); i++) {
                Service service = new Service();
                service.setHotel(hotel);
                service.setDescription(serviceDescriptions.get(i));
                service.setDisplayOrder(i);
                service.setIsActive(true);
                services.add(service);
            }
        }
        return services;
    }

    private List<User> createUsers() {
        String encodedPassword = passwordEncoder.encode("password123");

        return Arrays.asList(
                createUser("john.doe@email.com", encodedPassword, "John", "Doe", "+14165551234", "123 Main St, Toronto, ON"),
                createUser("jane.smith@email.com", encodedPassword, "Jane", "Smith", "+16045556789", "456 Oak Ave, Vancouver, BC"),
                createUser("bob.johnson@email.com", encodedPassword, "Bob", "Johnson", "+15145554321", "789 Pine Rd, Montreal, QC"),
                createUser("alice.williams@email.com", encodedPassword, "Alice", "Williams", "+12125558765", "321 Park Ave, New York, NY"),
                createUser("charlie.brown@email.com", encodedPassword, "Charlie", "Brown", "+13105554321", "654 Sunset Blvd, Los Angeles, CA"),
                createUser("emma.davis@email.com", encodedPassword, "Emma", "Davis", "+13125556543", "987 Lake Shore Dr, Chicago, IL"),
                createUser("oliver.wilson@email.com", encodedPassword, "Oliver", "Wilson", "+442079876543", "12 Oxford St, London, UK"),
                createUser("sophie.martin@email.com", encodedPassword, "Sophie", "Martin", "+33145678901", "34 Champs-Élysées, Paris, France"),
                createUser("takashi.yamamoto@email.com", encodedPassword, "Takashi", "Yamamoto", "+81334567890", "56 Shinjuku, Tokyo, Japan"),
                createUser("mia.anderson@email.com", encodedPassword, "Mia", "Anderson", "+61298765432", "78 Bondi Beach, Sydney, Australia")
        );
    }

    private User createUser(String email, String passwordHash, String firstName, String lastName, String phone, String address) {
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordHash);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhone(phone);
        user.setAddress(address);
        user.setMemberSince(String.valueOf(LocalDate.now().getYear()));
        user.setIsActive(true);
        return user;
    }

    private List<Staff> createStaff() {
        String encodedPassword = passwordEncoder.encode("admin123");

        return Arrays.asList(
                createStaff("admin@overnight.com", encodedPassword, "Admin", "User", "+14165550001", "ADMIN"),
                createStaff("manager@overnight.com", encodedPassword, "Manager", "User", "+14165550002", "ADMIN"),
                createStaff("reception1@overnight.com", encodedPassword, "Sarah", "Johnson", "+14165550003", "STAFF"),
                createStaff("reception2@overnight.com", encodedPassword, "Michael", "Chen", "+14165550004", "STAFF"),
                createStaff("housekeeping@overnight.com", encodedPassword, "Maria", "Garcia", "+14165550005", "STAFF")
        );
    }

    private Staff createStaff(String email, String passwordHash, String firstName, String lastName, String phone, String role) {
        Staff staff = new Staff();
        staff.setEmail(email);
        staff.setPasswordHash(passwordHash);
        staff.setFirstName(firstName);
        staff.setLastName(lastName);
        staff.setPhone(phone);
        staff.setRole(role);
        staff.setIsActive(true);
        return staff;
    }

    private List<Reservation> createReservations(List<User> users, List<Room> rooms) {
        List<Reservation> reservations = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 0; i < 20; i++) {
            User user = users.get(i % users.size());
            Room room = rooms.get(i % rooms.size());

            LocalDate checkIn = today.plusDays(i % 5);
            LocalDate checkOut = checkIn.plusDays((i % 5) + 1);
            long nights = checkIn.until(checkOut).getDays();

            Reservation reservation = new Reservation();
            reservation.setReservationNumber("RES-" + System.currentTimeMillis() + i);
            reservation.setUser(user);
            reservation.setRoom(room);
            reservation.setCheckInDate(checkIn.toString());
            reservation.setCheckOutDate(checkOut.toString());
            reservation.setNights((int) nights);
            reservation.setGuests((i % 3) + 1);
            reservation.setTotalPrice(room.getPrice() * nights + (i * 10));
            reservation.setSpecialRequests(i % 3 == 0 ? "Extra pillows and late check-out requested" : "");
            reservation.setStatus(i % 3 == 0 ? "ACTIVE" : i % 3 == 1 ? "UPCOMING" : "COMPLETED");
            reservation.setIsActive(true);
            reservations.add(reservation);
        }

        return reservations;
    }

    private List<Payment> createPayments(List<Reservation> reservations, List<User> users) {
        List<Payment> payments = new ArrayList<>();

        for (int i = 0; i < reservations.size(); i++) {
            Reservation reservation = reservations.get(i);
            if (i % 2 == 0 || reservation.getStatus().equals("COMPLETED")) {
                Payment payment = new Payment();
                payment.setReservation(reservation);
                payment.setUser(reservation.getUser());
                payment.setTransactionId("TXN-" + System.currentTimeMillis() + i);
                payment.setAmount(reservation.getTotalPrice());
                payment.setMethod(i % 3 == 0 ? "CREDIT_CARD" : i % 3 == 1 ? "DEBIT_CARD" : "PAYPAL");
                payment.setStatus(i % 3 == 0 ? "COMPLETED" : i % 3 == 1 ? "PENDING" : "COMPLETED");
                payment.setCardNumber("•••• •••• •••• " + String.format("%04d", 1000 + i));
                payment.setPaymentDate(LocalDate.now().minusDays(i % 30).toString());
                payment.setPaymentTime(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
                payment.setIsActive(true);
                payments.add(payment);
            }
        }
        return payments;
    }

    private List<Receipt> createReceipts(List<Payment> payments, List<Reservation> reservations, List<User> users) {
        List<Receipt> receipts = new ArrayList<>();

        for (int i = 0; i < payments.size(); i++) {
            Payment payment = payments.get(i);
            Reservation reservation = payment.getReservation();
            User user = reservation.getUser();

            Receipt receipt = new Receipt();
            receipt.setReceiptNumber("RCP-" + System.currentTimeMillis() + i);
            receipt.setPayment(payment);
            receipt.setReservation(reservation);
            receipt.setUser(user);
            receipt.setCustomerName(user.getFullName());
            receipt.setCustomerEmail(user.getEmail());
            receipt.setHotelName(reservation.getHotelName());
            receipt.setRoomNumber(reservation.getRoomNumber());
            receipt.setPaymentMethod(payment.getMethod());
            receipt.setPaymentDate(payment.getPaymentDate());
            receipt.setPaymentTime(payment.getPaymentTime());
            receipt.setTransactionId(payment.getTransactionId());
            receipt.setAmount(payment.getAmount() * 0.85);
            receipt.setTax(payment.getAmount() * 0.10);
            receipt.setServiceFee(payment.getAmount() * 0.05);
            receipt.setTotalAmount(payment.getAmount());
            receipt.setStatus(payment.getStatus());
            receipt.setIsActive(true);

            receipts.add(receipt);
        }

        return receipts;
    }
}