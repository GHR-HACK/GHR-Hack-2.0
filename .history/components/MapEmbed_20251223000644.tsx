"use client"

import React from 'react'

export default function MapEmbed() {
  return (
    <section aria-label="Location map" className="py-8 bg-white">
      <div className="w-full px-4 sm:px-6">
        <h3 className="text-center text-lg font-semibold mb-4 text-[#ff5100]">Location</h3>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 12 }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.7604236925226!2d75.55350229999999!3d20.962134099999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd90e6dda5a2297%3A0xed1012e1b1c57106!2sG%20H%20Raisoni%20Institute%20of%20Engineering%20and%20Business%20Management%20jalgaon!5e0!3m2!1sen!2sin!4v1766428224886!5m2!1sen!2sin"
            title="G H Raisoni Institute Location"
            aria-label="G H Raisoni Institute location on Google Maps"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}
