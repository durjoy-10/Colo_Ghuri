import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import DestinationCard from "../components/destinations/DestinationCard";
import TourCard from "../components/tours/TourCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";

const Home = () => {
  const { get, loading } = useApi();
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [upcomingTours, setUpcomingTours] = useState([]);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [destinationsRes, toursRes] = await Promise.all([
        get("/destinations/?is_popular=true", false),
        get("/tours/?status=upcoming", false),
      ]);
      setPopularDestinations(destinationsRes?.results || destinationsRes || []);
      setUpcomingTours(toursRes?.results || toursRes || []);
    } catch (error) {
      console.error("Error fetching home data:", error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      {/* // Hero Section (replace in Home.jsx) */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-secondary-900/90 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Animated Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container-custom relative z-20 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white text-sm">
                  Explore Bangladesh with us
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Discover the{" "}
                <span className="gradient-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Beauty
                </span>{" "}
                of Bangladesh
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Your ultimate travel companion for exploring breathtaking
                destinations, booking amazing tours, and creating unforgettable
                memories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/destinations"
                  className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2 group"
                >
                  Explore Destinations
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/tours"
                  className="btn-secondary text-lg px-8 py-3 inline-flex items-center gap-2"
                >
                  View Tours
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-white/20">
              <div className="text-center animate-slide-up">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-white/70 text-sm">Destinations</div>
              </div>
              <div className="text-center animate-slide-up animate-delay-100">
                <div className="text-3xl font-bold text-white">100+</div>
                <div className="text-white/70 text-sm">Expert Guides</div>
              </div>
              <div className="text-center animate-slide-up animate-delay-200">
                <div className="text-3xl font-bold text-white">10k+</div>
                <div className="text-white/70 text-sm">Happy Travellers</div>
              </div>
              <div className="text-center animate-slide-up animate-delay-300">
                <div className="text-3xl font-bold text-white">4.9</div>
                <div className="text-white/70 text-sm">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose Colo Ghuri?</h2>
            <p className="section-subtitle">
              We make your travel experience unforgettable
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="text-2xl text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Explore Destinations
              </h3>
              <p className="text-gray-600">
                Discover the most beautiful places in Bangladesh with detailed
                guides
              </p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMoneyBillWave className="text-2xl text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Get the best deals and discounts on tour packages
              </p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-2xl text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Guides</h3>
              <p className="text-gray-600">
                Professional local guides for authentic experiences
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="section-title">Popular Destinations</h2>
              <p className="section-subtitle">
                Most visited places in Bangladesh
              </p>
            </div>
            <Link
              to="/destinations"
              className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center gap-1"
            >
              View All <FaArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.slice(0, 6).map((dest) => (
              <DestinationCard key={dest.destination_id} destination={dest} />
            ))}
          </div>
        </div>
      </section>
      {/* Upcoming Tours */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="section-title">Upcoming Tours</h2>
              <p className="section-subtitle">Book your next adventure</p>
            </div>
            <Link
              to="/tours"
              className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center gap-1"
            >
              View All <FaArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTours.slice(0, 6).map((tour) => (
              <TourCard key={tour.tour_id} tour={tour} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
