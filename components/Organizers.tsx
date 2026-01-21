'use client';

import { useState } from 'react';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';
import { organizers } from '../lib/data';
import { User } from 'lucide-react';

export default function Organizers() {

  const teamRoles = [
    { key: 'design', title: 'Design Team', color: 'text-pink-400', icon: '🎨' },
    { key: 'marketing', title: 'Marketing Team', color: 'text-green-400', icon: '📢' },
    { key: 'finance', title: 'Finance Team', color: 'text-yellow-400', icon: '💰' },
    { key: 'logistic', title: 'Logistics Team', color: 'text-purple-400', icon: '🚚' },
    { key: 'operations', title: 'Operations Team', color: 'text-red-400', icon: '⚙️' },
  ];

  return (
    <section
      id="team"
      className="py-6 md:py-8 bg-white"
    >

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center ">
          <Title level={2} variant="gradient" size="xl" className="">
            Meet Our Team
          </Title>

        </div>

        <div className="organizers-grid space-y-10">
          {/* Overall Coordinators */}
          <div>
            <Title level={4} variant="default" size="lg" className="mb-8 !text-[#ff5100]">
              Overall Coordinators
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto justify-items-center">
              {organizers.coordinators.map((coordinator, index) => {
                const [imageError, setImageError] = useState(false);
                const hasImage = coordinator?.image && !imageError;
                
                return (
                  <div
                    key={index}
                    className="organizer-card group relative h-96 w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 ease-in-out hover:shadow-2xl hover:shadow-purple-400/20 hover:scale-[1.02] hover:translate-y-[-4px]"
                  >
                    {hasImage ? (
                      <img
                        src={coordinator.image}
                        alt={coordinator.name}
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
                          <h4 className="text-2xl font-bold text-white mb-2">{coordinator.name}</h4>
                          <p className="text-white/90 text-base leading-relaxed">{coordinator.role}</p>
                        </div></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Co-Leads */}
          {organizers?.coLeads && organizers.coLeads.length > 0 && (
            <div>
              <Title level={4} variant="default" size="lg" className="mb-8 !text-[#ff5100]">
                Co-Leads
              </Title>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto justify-items-center">
                {organizers.coLeads.map((coLead, index) => {
                  const [imageError, setImageError] = useState(false);
                  const hasImage = coLead?.image && !imageError;
                  
                  return (
                    <div
                      key={index}
                      className="organizer-card group relative h-96 w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 ease-in-out hover:shadow-2xl hover:shadow-purple-400/20 hover:scale-[1.02] hover:translate-y-[-4px]"
                    >
                      {hasImage ? (
                        <img
                          src={coLead.image}
                          alt={coLead.name}
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
                            <h4 className="text-2xl font-bold text-white mb-2">{coLead.name}</h4>
                            <p className="text-white/90 text-base leading-relaxed">{coLead.role}</p>
                          </div></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Leads */}
          {organizers?.leads && organizers.leads.length > 0 && (
            <div>
              <Title level={4} variant="default" size="lg" className="mb-8 !text-[#ff5100]">
                Leads
              </Title>
              <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
                {organizers.leads.map((lead, index) => {
                  const [imageError, setImageError] = useState(false);
                  const hasImage = lead?.image && !imageError;
                  
                  return (
                    <div
                      key={index}
                      className="organizer-card group relative h-80 w-full max-w-sm md:w-[calc((100%-8rem)/5)] lg:w-[calc((100%-8rem)/5)] overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 ease-in-out hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02] hover:translate-y-[-4px]"
                    >
                      {hasImage ? (
                        <img
                          src={lead.image}
                          alt={lead.name}
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
                            <h4 className="text-2xl font-bold text-white mb-2">{lead.name}</h4>
                            <p className="text-white/90 text-base leading-relaxed">{lead.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Team Roles 
          {teamRoles.map((role) => (
            <div key={role.key}>
              <Title level={3} variant="default" size="md" className={`text-center mb-8 ${role.color}`}>
                {role.title}
              </Title>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(organizers[role.key as keyof typeof organizers] as string[]).map((member: string, index: number) => (
                  <Card
                    key={index}
                    variant="glass"
                    hover
                    className="organizer-card group"
                  >
                    <div className="p-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-primary-orange/20 to-primary-purple/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl">{role.icon}</span>
                      </div>
                      <h5 className="text-sm font-red-hat-display font-bold text-black/70 group-hover:gradient-text transition-all duration-300">
                        {member}
                      </h5>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
          */}
        </div>
      </div>
    </section>
  );
}