"use client";

import { API_BASE_URL } from "@/app/config/api";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Occupant {
  firstName: string;
  lastName: string;
  email: string;
}

interface Room {
  roomNumber: string;
  occupants: Occupant[];
}

type OccupancyFilterType = "all" | "occupied" | "vacant";
type FloorFilterType = "all" | 1 | 2 | 3 | 4 | 5 | 6;

const ViewRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [occupancyFilter, setOccupancyFilter] =
    useState<OccupancyFilterType>("all");
  const [floorFilter, setFloorFilter] = useState<FloorFilterType>("all");
  const router = useRouter();

  const fetchRooms = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/get-All-Roomamtes`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Filter rooms based on selected filters
  const filterRooms = (rooms: Room[]) => {
    let filteredRooms = [...rooms];

    // Apply occupancy filter
    if (occupancyFilter === "occupied") {
      filteredRooms = filteredRooms.filter((room) => room.occupants.length > 0);
    } else if (occupancyFilter === "vacant") {
      filteredRooms = filteredRooms.filter(
        (room) => room.occupants.length === 0
      );
    }

    // Apply floor filter
    if (floorFilter !== "all") {
      filteredRooms = filteredRooms.filter(
        (room) => Math.floor(parseInt(room.roomNumber) / 100) === floorFilter
      );
    }

    return filteredRooms;
  };

  // Group rooms by floor
  const roomsByFloor = filterRooms(rooms).reduce(
    (acc: Record<number, Room[]>, room) => {
      const floor = Math.floor(parseInt(room.roomNumber) / 100);
      if (!acc[floor]) {
        acc[floor] = [];
      }
      acc[floor].push(room);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text">
                HMS
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                |
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                View Rooms
              </span>
            </div>
            <button
              onClick={() => router.push("/admin/rooms")}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </button>
          </div>
        </div>
      </nav>

      {/* Enhanced Filter Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Occupancy Filter */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
                Status:
              </span>
              <div className="flex gap-2">
                {[
                  { label: "All", value: "all" },
                  { label: "Occupied", value: "occupied" },
                  { label: "Vacant", value: "vacant" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setOccupancyFilter(option.value as OccupancyFilterType)
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      occupancyFilter === option.value
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Floor Filter */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
                Floor:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFloorFilter("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    floorFilter === "all"
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  All Floors
                </button>
                {[1, 2, 3, 4, 5, 6].map((floor) => (
                  <button
                    key={floor}
                    onClick={() => setFloorFilter(floor as FloorFilterType)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      floorFilter === floor
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    Floor {floor}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {[1, 2, 3, 4, 5, 6].map(
          (floor) =>
            roomsByFloor[floor]?.length > 0 && (
              <div key={floor} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Floor {floor}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {roomsByFloor[floor]
                    ?.sort(
                      (a, b) => parseInt(a.roomNumber) - parseInt(b.roomNumber)
                    )
                    .map((room) => (
                      <div
                        key={room.roomNumber}
                        className="bg-white dark:bg-gray-800 rounded-[24px] shadow-lg hover:shadow-xl transition-all duration-200 p-5 border border-gray-200 dark:border-gray-700 hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Room {room.roomNumber}
                          </h3>
                          <span
                            className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                              room.occupants.length === 0
                                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            }`}
                          >
                            {room.occupants.length === 0
                              ? "Vacant"
                              : `${room.occupants.length} Occupant${
                                  room.occupants.length > 1 ? "s" : ""
                                }`}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {room.occupants.map((occupant, index) => (
                            <div
                              key={index}
                              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-[18px] transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <div className="font-medium text-gray-900 dark:text-white">
                                {`${occupant.firstName} ${occupant.lastName}`}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {occupant.email}
                              </div>
                            </div>
                          ))}
                          {room.occupants.length === 0 && (
                            <div className="text-center py-6">
                              <div className="text-gray-400 dark:text-gray-500">
                                <svg
                                  className="w-12 h-12 mx-auto mb-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                  />
                                </svg>
                                <p className="text-sm">
                                  This room is currently vacant
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default ViewRooms;
