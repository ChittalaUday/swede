"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Phone,
  Mail,
  Heart,
} from "lucide-react";

export default function WeddingDetailsPage() {
  const [weddingDate] = useState(new Date("2025-10-27T13:54:00"));

  // Format the wedding date for display
  const formattedWeddingDate = weddingDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedWeddingTime = weddingDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Wedding Details
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join us as we celebrate the beginning of our journey together
          </p>
        </motion.div>

        {/* Couple Names Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row items-center justify-between mb-10">
            <div className="text-center mb-6 md:mb-0">
              <h2 className="text-3xl font-bold text-primary">Swetha</h2>
              <Separator className="my-2 w-16 mx-auto bg-primary" />
            </div>

            <div className="text-5xl text-muted-foreground mx-4 mb-4 md:mb-0">
              <Heart className="text-primary" fill="currentColor" />
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-primary">Depak</h2>
              <Separator className="my-2 w-16 mx-auto bg-primary" />
            </div>
          </div>
        </motion.section>

        {/* Event Details Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Event Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Card */}
            <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="text-primary" />
                  Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{formattedWeddingDate}</p>
                <p className="text-muted-foreground mt-1">
                  {formattedWeddingTime} IST
                </p>
              </CardContent>
            </Card>

            {/* Venue Card */}
            <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="text-primary" />
                  Venue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">
                  Devathilakula Kalyanamandapam
                </p>
                <p className="text-muted-foreground mt-1">
                  X734+79V, Dwaraka Tirumala, Andhra Pradesh 534426
                </p>
                <Button variant="link" className="p-0 mt-2 h-auto" asChild>
                  <a
                    href="https://maps.app.goo.gl/Yitj12cqnfzsnbnw9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View on Google Maps
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Schedule Card */}
            <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="text-primary" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Mehendi Ceremony</span>
                    <span className="font-medium">10:00 AM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Wedding Ceremony</span>
                    <span className="font-medium">5:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Reception</span>
                    <span className="font-medium">8:00 PM</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Attire Card */}
            <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="text-primary" />
                  Attire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">Traditional Indian Wear</p>
                <p className="text-muted-foreground mt-1">
                  We recommend wearing comfortable traditional attire in festive
                  colors.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="secondary">Sarees</Badge>
                  <Badge variant="secondary">Sherwanis</Badge>
                  <Badge variant="secondary">Lehengas</Badge>
                  <Badge variant="secondary">Kurtas</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Contact Information Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm">
              <CardContent className="flex items-center p-4">
                <Phone className="text-primary mr-3" />
                <div>
                  <p className="font-medium">Wedding Coordinators</p>
                  <p className="text-muted-foreground">
                    7330365208, 8309154716
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm">
              <CardContent className="flex items-center p-4">
                <Mail className="text-primary mr-3" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">chitalauday@gmail.com</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Photo Gallery Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Photo Gallery
          </h2>

          <div className="text-center mb-8">
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our special moments will be captured and shared here after the
              wedding.
            </p>
            <Button asChild>
              <Link href="/photo-gallery">View Full Gallery</Link>
            </Button>
          </div>
        </motion.section>

        {/* RSVP Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            RSVP
          </h2>

          <div className="text-center">
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Please let us know if you{`'`}ll be joining us for our special
              day. Kindly respond by October 20, 2025.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="px-8 py-6 text-lg rounded-full">
                Accept Invitation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg rounded-full border-2"
              >
                Decline
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 text-center"
        >
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80"
            asChild
          >
            <Link href="/">← Back to Home</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
