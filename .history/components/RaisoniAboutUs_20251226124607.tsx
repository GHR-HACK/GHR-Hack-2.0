'use client';

import Container from './ui/Container';
import Title from './ui/Title';

export default function RaisoniAboutUs() {
  return (
    <section id="raisoni-about" className="py-12 md:py-16 bg-white">
     
        <div className="max-w-7xl  px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="text-left">
            <Title level={3} variant="gradient" size="md" className="mb-4">
              About us
            </Title>
            <div className="prose prose-lg max-w-none">
              <p className="text-black text-lg leading-relaxed text-justify font-red-hat-display">
                Raisoni Education is a group of colleges offering a wide range of programs across over 100 courses and serving more than 28,000 students. The Raisoni Group has made a strong mark in education with the motto "A Vision Beyond", and remains committed to enlightening minds and empowering ambitions.
              </p>
              <p className="text-black text-lg leading-relaxed text-justify font-red-hat-display">
                G H Raisoni College of Engineering & Management, Jalgaon is an autonomous, NAAC-accredited 'A' grade institute affiliated to Kavayitri Bahinabai Chaudhari North Maharashtra University, Jalgaon, and approved by AICTE. The college offers flagship programs in engineering and management, backed by a strong focus on academic excellence and student development.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
