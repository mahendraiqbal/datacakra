"use client";

import React, { useRef, useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

import imageLanding from "../../public/v660-mon-04-travelbadge.jpg";

const navigation = [
  { name: "Description", href: "description", current: true },
  { name: "Stories", href: "stories", current: false },
  { name: "Reviews", href: "reviews", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ModernLandingPage() {
  const descriptionRef = useRef(null);
  const storiesRef = useRef(null);
  const reviewsRef = useRef(null);
  const [activeSection, setActiveSection] = useState("description");
  const [sectionVisibility, setSectionVisibility] = useState({
    description: false,
    stories: false,
    reviews: false,
  });

  const scrollToSection = (sectionRef) => {
    navigation.forEach((item) => {
      item.current = item.href === sectionRef.current.id;
    });

    const sectionId = sectionRef.current.id;
    setActiveSection(sectionId);

    sectionRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setSectionVisibility((prev) => ({
          ...prev,
          [entry.target.id]: entry.isIntersecting,
        }));
      });
    }, observerOptions);

    const sections = [
      descriptionRef.current,
      storiesRef.current,
      reviewsRef.current,
    ];

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="font-['Inter'] bg-gray-50">
      <Disclosure
        as="nav"
        className="bg-gradient-to-r from-blue-900 to-indigo-900 sticky top-0 z-50 shadow-lg"
      >
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img
                  alt="Your Company"
                  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => {
                        if (item.href === "description")
                          scrollToSection(descriptionRef);
                        if (item.href === "stories")
                          scrollToSection(storiesRef);
                        if (item.href === "reviews")
                          scrollToSection(reviewsRef);
                      }}
                      aria-current={
                        item.href === activeSection ? "page" : undefined
                      }
                      className={classNames(
                        item.href === activeSection
                          ? "bg-indigo-700 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out"
                      )}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/auth/login"
                className="text-white hover:text-blue-300 transition-colors duration-300 font-semibold"
              >
                Login
              </a>
              <a
                href="/auth/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300"
              >
                Register
              </a>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 bg-gray-800">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.href}
                onClick={() => {
                  if (item.href === "description")
                    scrollToSection(descriptionRef);
                  if (item.href === "stories") scrollToSection(storiesRef);
                  if (item.href === "reviews") scrollToSection(reviewsRef);
                }}
                aria-current={item.href === activeSection ? "page" : undefined}
                className={classNames(
                  item.href === activeSection
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative py-12">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl animate-fade-in">
            <Image
              src={imageLanding}
              alt="Image Landing"
              className="w-full h-auto blur-sm object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold text-center px-4 max-w-4xl drop-shadow-lg">
                Discover New Places and Create Unforgettable Memories
              </h1>
            </div>
          </div>
        </div>

        <section
          ref={descriptionRef}
          id="description"
          className={`py-12 transition-all duration-1000 ${sectionVisibility.description ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-4xl font-bold mb-6 text-gray-800">Description</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Explore captivating destinations and travel tips with our travel
            article app, designed to inspire your wanderlust, guide your
            adventures, and provide valuable insights for seamless journeys
            worldwide.
          </p>
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-700">
              Detail Product
            </h3>
            <ul className="list-none pl-0 mt-4 space-y-4">
              {[
                "Travel Articles: Explore a collection of curated travel articles that inspire your next adventure. Discover hidden gems, travel tips, and captivating stories from around the world.",
                "Travel Categories: Easily navigate through destinations with categories like serene villages, lush forests, and vibrant cities. Find the perfect place that matches your travel style.",
                "Featured Reviews: Gain confidence in your journey by browsing trusted reviews. Learn from other travelers' experiences and make informed decisions for a memorable trip.",
              ].map((item, index) => (
                <li
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start"
                >
                  <span className="mr-4 text-2xl font-bold text-blue-600">
                    {index + 1}.
                  </span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          ref={storiesRef}
          id="stories"
          className={`py-12 bg-gray-100 rounded-xl transition-all duration-1000 ${sectionVisibility.stories ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-4xl font-bold mb-6 text-gray-800">
            Traveler Stories
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Dive into the inspiring stories shared by our travelers. Click on
            the "Stories" button in the navigation bar, and the screen will
            scroll seamlessly to this section.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "A Journey Through the Alps",
                description:
                  "An unforgettable adventure in the heart of Europe's most stunning mountain range.",
              },
              {
                title: "Discovering Hidden Beaches",
                description:
                  "A traveler's tale of finding serene, untouched shores away from the crowds.",
              },
            ].map((story, index) => (
              <div
                key={story.title}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {story.title}
                </h3>
                <p className="text-gray-600">{story.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          ref={reviewsRef}
          id="reviews"
          className={`py-12 transition-all duration-1000 ${sectionVisibility.reviews ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-4xl font-bold mb-6 text-gray-800">
            User Reviews
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Explore honest reviews shared by our travelers. Click on the
            "Reviews" button in the navigation to scroll directly to this
            section.
          </p>
          <div className="space-y-6">
            {[
              {
                title: "Fantastic City Getaway",
                quote:
                  "The city tour was incredible! Everything was well-organized, and the guides were very knowledgeable.",
                rating: 4,
              },
              {
                title: "Memorable Forest Adventure",
                quote:
                  "A magical experience walking through the serene forests. Highly recommended for nature lovers!",
                rating: 5,
              },
            ].map((review, index) => (
              <div
                key={review.title}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {review.title}
                </h3>
                <p className="text-gray-600 italic mb-4">"{review.quote}"</p>
                <div className="text-yellow-500 text-2xl">
                  {[...Array(review.rating)].map((_, i) => "★")}
                  {[...Array(5 - review.rating)].map((_, i) => "☆")}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
