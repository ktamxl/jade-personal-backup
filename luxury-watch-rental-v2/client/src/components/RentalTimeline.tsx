import { format } from "date-fns";
import { Check, X, Clock, Calendar } from "lucide-react";

interface RentalTimelineProps {
  rental: {
    status: string;
    createdAt: Date | string;
    activatedAt?: Date | string | null;
    completedAt?: Date | string | null;
    cancelledAt?: Date | string | null;
  };
}

export default function RentalTimeline({ rental }: RentalTimelineProps) {
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return null;
    return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
  };

  const steps = [
    {
      label: "Booking Created",
      timestamp: rental.createdAt,
      icon: Calendar,
      completed: true,
      color: "luxury-gold",
    },
    {
      label: "Rental Active",
      timestamp: rental.activatedAt,
      icon: Clock,
      completed: !!rental.activatedAt,
      color: "luxury-gold",
    },
    {
      label: rental.status === "cancelled" ? "Rental Cancelled" : "Watch Returned",
      timestamp: rental.cancelledAt || rental.completedAt,
      icon: rental.status === "cancelled" ? X : Check,
      completed: !!rental.completedAt || !!rental.cancelledAt,
      color: rental.status === "cancelled" ? "red-500" : "luxury-gold",
    },
  ];

  return (
    <div className="py-4">
      <div className="flex items-start justify-between relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          
          return (
            <div key={index} className="flex-1 relative">
              <div className="flex flex-col items-center">
                {/* Icon Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 ${
                    step.completed
                      ? `bg-${step.color} border-${step.color}`
                      : "bg-eerie-black-1 border-jet"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      step.completed ? "text-smoky-black" : "text-light-gray-70"
                    }`}
                  />
                </div>

                {/* Connecting Line */}
                {!isLast && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-0.5 ${
                      steps[index + 1].completed ? "bg-luxury-gold" : "bg-jet"
                    }`}
                    style={{ transform: "translateY(-50%)" }}
                  />
                )}

                {/* Label and Timestamp */}
                <div className="mt-3 text-center">
                  <p
                    className={`text-sm font-medium ${
                      step.completed ? "text-white-2" : "text-light-gray-70"
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.timestamp && (
                    <p className="text-xs text-light-gray-70 mt-1">
                      {formatDate(step.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
