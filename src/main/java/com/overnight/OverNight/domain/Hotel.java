package com.overnight.OverNight.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "hotels")
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "city_id")
    private City city;

    private String chain;

    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String email;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "check_in")
    private String checkIn;

    @Column(name = "check_out")
    private String checkOut;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_chain_id")
    private HotelChain hotelChain;

    @JsonIgnore
    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Room> rooms = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "hotel_hotel_amenities",
            joinColumns = @JoinColumn(name = "hotel_id"),
            inverseJoinColumns = @JoinColumn(name = "hotel_amenity_id")
    )
    private List<HotelAmenity> hotelAmenities = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RoomPolicy> policies = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Service> services = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (checkIn == null) {
            checkIn = "15:00";
        }
        if (checkOut == null) {
            checkOut = "11:00";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getFullAddress() {
        return address + ", " + city;
    }

    public String getCityName() {
        return city != null ? city.getName() : null;
    }

    public Long getHotelChainId() {
        return hotelChain != null ? hotelChain.getId() : null;
    }

    public String getHotelChainName() {
        return hotelChain != null ? hotelChain.getName() : null;
    }

    @JsonProperty("chain")
    public String getChain() {
        if (hotelChain != null) {
            return hotelChain.getName();
        }
        return chain;
    }

    @JsonProperty("chain")
    public void setChain(String chain) {
        this.chain = chain;
    }

    @JsonProperty("hotelChain")
    public HotelChain getHotelChain() {
        return hotelChain;
    }

    @JsonProperty("hotelChain")
    public void setHotelChain(HotelChain hotelChain) {
        this.hotelChain = hotelChain;
    }
}