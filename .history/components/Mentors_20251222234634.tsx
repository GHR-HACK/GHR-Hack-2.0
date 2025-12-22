"use client"

import { useRef, useState } from "react"
import { Phone, User } from "lucide-react"
import Card from "./ui/Card"
import Title from "./ui/Title"
import Container from "./ui/Container"
import { mentors } from "@/lib/data"

export default function Mentors() {
  const sectionRef = useRef<HTMLDivElement>(null)

  // Safety check
  if (!mentors) {
    return null
  }

  const renderMentorCard = (mentor: any, index: number, cardClass = "") => (
    <Card key={index} className={`mentor-card group ${cardClass} hover:shadow-lg transition-all duration-300`}>
      <div className="p-6 text-center">
        <div className="relative w-24 h-24 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
          {mentor?.image ? (
            <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-black/10 group-hover:ring-purple-600/30 transition-all duration-300 shadow-lg">
              <img
                src={mentor.image || "/placeholder.svg"}
                alt={mentor.name || "Profile"}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">{mentor?.name?.charAt(0) || "?"}</span>
            </div>
          )}
        </div>
        <h4 className="text-xl font-bold text-foreground mb-1">{mentor.title || mentor.name}</h4>
        <p className="text-muted-foreground text-sm">{mentor.role}</p>
        {mentor.phone && <p className="text-purple-600 text-sm mt-2">📞 {mentor.phone}</p>}
      </div>
    </Card>
  )

  const renderCoordinatorCard = (coordinator: any, index: number) => (
    <Card key={index} className="mentor-card group hover:shadow-lg transition-all duration-300">
      <div className="p-6 text-center">
        <h4 className="text-xl font-bold text-gray-800 mb-3">{coordinator.name}</h4>
        {coordinator.phone && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-purple-600 text-lg"><Phone className="w-5 h-5" /></span>
            <p className="text-purple-600 font-semibold">{coordinator.phone}</p>
          </div>
        )}
      </div>
    </Card>
  )

  const renderProfileCard = (mentor: any, index: number) => {
    const [imageError, setImageError] = useState(false);
    const hasImage = mentor?.image && !imageError;
    
    return (
      <div
        key={index}
        className="mentor-card group relative h-96 w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 ease-in-out hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02] hover:translate-y-[-4px]"
      >
        {hasImage ? (
          <img
            src={mentor.image}
            alt={mentor.name}
            className="w-full h-full object-cover rounded-3xl"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-3xl">
            <User className="w-32 h-32 text-gray-500" />
          </div>
        )}
        {/* Default overlay - visible on mobile, hidden on hover desktop */}
        <div className="absolute inset-0  rounded-3xl flex flex-col justify-end  md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-gradient-to-t from-purple-900/95 via-purple-800/60 to-transparent">
            <div className="p-8">
              <h4 className="text-2xl font-bold text-white mb-2">{mentor.name}</h4>
              <p className="text-white/90 text-base leading-relaxed">{mentor.role}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="patrons" ref={sectionRef} className="py-6 md:py-12 bg-background">
      <Container>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center ">
            <Title level={2} variant="gradient" size="xl" className="mb-8">
              Meet Our Mentors
            </Title>
           
          </div>

          <div className="space-y-16">
            {/* Chief Patron */}
            {mentors?.chiefPatron && (
              <div className="text-center">
                <Title level={3} variant="default" size="lg" className="mb-8 !text-[#ff5100]">
                  Chief Patron
                </Title>
                <div className="flex flex-wrap justify-center gap-24 max-w-5xl mx-auto">
                  {renderProfileCard(mentors.chiefPatron, 0)}
                </div>
              </div>
            )}

            {/* Patron */}
            {mentors?.patron && (
              <div className="text-center">
                <Title level={3} variant="default" size="lg" className="mb-8 !text-[#ff5100]">
                  Patron
                </Title>
                <div className="flex flex-wrap justify-center gap-24 max-w-5xl mx-auto">
                  {renderProfileCard(mentors.patron, 0)}
                </div>
              </div>
            )}

            {/* Organizing Chairs */}
            {mentors?.organizingChairs && mentors.organizingChairs.length > 0 && (
              <div className="text-center">
                <Title level={3} variant="default" size="lg" className="mb-8 !text-[#ff5100]">
                  Organizing Chairs
                </Title>
                <div className="flex flex-wrap justify-center gap-24 max-w-5xl mx-auto">
                  {mentors.organizingChairs.map((chair, index) => renderProfileCard(chair, index))}
                </div>
              </div>
            )}

            {/* Convener */}
            {mentors?.convener && mentors.convener.length > 0 && (
              <div className="text-center">
                <Title level={3} variant="default" size="lg" className="mb-8 !text-[#ff5100]">
                  Convener
                </Title>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-24 max-w-6xl mx-auto">
                  {mentors.convener.map((convener, index) => renderProfileCard(convener, index))}
                </div>
              </div>
            )}


            {/* Faculty Coordinator 
            {mentors?.facultyCoordinator && (
              <div className="text-center">
                <Title level={3} variant="default" size="lg" className="mb-8 text-purple-500">
                  Faculty Coordinator
                </Title>
                <div className="flex justify-center">
                  {renderMentorCard(mentors.facultyCoordinator, 0, "max-w-sm mx-auto")}
                </div>
              </div>
            )}
            */}

            {/* Coordinators */}
            {mentors?.coordinators && mentors.coordinators.length > 0 && (
              <div className="text-center">
               <Title level={3} variant="default" size="lg" className="mb-8 !text-[#ff5100]">
                  Event Coordinators
                </Title>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto justify-items-center">
                  {mentors.coordinators.map((coordinator, index) => renderCoordinatorCard(coordinator, index))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
