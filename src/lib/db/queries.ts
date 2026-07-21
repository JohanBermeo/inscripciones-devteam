import type { Client } from '@libsql/client';

export interface RegistrationData {
  fullName: string;
  email: string;
  availabilityHours: number;
  specialtyArea: string;
  currentSemester: number;
  linkedinUrl?: string;
  githubUrl?: string;
  discordUsername?: string;
  motivation: string;
  ipHash: string;
  userAgentHash: string;
}

export async function insertRegistration(db: Client, data: RegistrationData): Promise<void> {
  await db.execute({
    sql: `INSERT INTO registrations (
      full_name, email, availability_hours, specialty_area, current_semester,
      linkedin_url, github_url, discord_username, motivation,
      ip_hash, user_agent_hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      data.fullName,
      data.email,
      data.availabilityHours,
      data.specialtyArea,
      data.currentSemester,
      data.linkedinUrl || null,
      data.githubUrl || null,
      data.discordUsername || null,
      data.motivation,
      data.ipHash,
      data.userAgentHash,
    ],
  });
}
