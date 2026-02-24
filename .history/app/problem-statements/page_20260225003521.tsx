'use client';

import Container from '@/components/ui/Container';
import Title from '@/components/ui/Title';
import ProblemStatementTabs from '@/components/ProblemStatementTabs';

export default function ProblemStatementsPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="px-4 pb-16 pt-28">
        <Container size="xl">
          <div className="mx-auto max-w-7xl">
            <div className="text-left">
              <Title level={2} variant="gradient" size="xl" align="left" className="mb-2">
                Problem Statements
              </Title>
              <p className="text-sm text-black/70 font-red-hat-display max-w-3xl">
                Browse the 10 hackathon themes and review the available problem statements. Each
                problem statement allows only four teams to register, so please login before
                selecting.
              </p>
            </div>

            <ProblemStatementTabs />
          </div>
        </Container>
      </div>
    </div>
  );
}
