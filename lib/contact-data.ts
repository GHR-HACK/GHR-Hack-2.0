import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ContactFormData } from './schemas/contact';

const DATA_FILE = join(process.cwd(), 'data', 'contacts.json');

interface ContactEntry extends ContactFormData {
  id: string;
  createdAt: string; // Store as ISO string for JSON
}

// Ensure data directory exists
import { mkdirSync } from 'fs';
try {
  mkdirSync(join(process.cwd(), 'data'), { recursive: true });
} catch (error) {
  // Directory might already exist
}

// Initialize empty contacts array if file doesn't exist
if (!existsSync(DATA_FILE)) {
  writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

export function getAllContacts(): (ContactFormData & { id: string; createdAt: Date })[] {
  try {
    const data = readFileSync(DATA_FILE, 'utf-8');
    const contacts = JSON.parse(data) as ContactEntry[];
    return contacts.map(contact => ({
      ...contact,
      createdAt: new Date(contact.createdAt) // Convert back to Date object
    }));
  } catch (error) {
    console.error('Error reading contacts data:', error);
    return [];
  }
}

export function addContact(contactData: ContactFormData): ContactFormData & { id: string; createdAt: Date } {
  try {
    const contacts = getAllContacts();

    const newContact: ContactEntry = {
      ...contactData,
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    contacts.push(newContact as any);
    writeFileSync(DATA_FILE, JSON.stringify(contacts, null, 2));

    return {
      ...newContact,
      createdAt: new Date(newContact.createdAt),
    };
  } catch (error) {
    console.error('Error adding contact:', error);
    throw new Error('Failed to save contact data');
  }
}

export function getContactCount(): number {
  return getAllContacts().length;
}
