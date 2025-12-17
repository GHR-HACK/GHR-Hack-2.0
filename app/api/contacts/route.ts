import { NextRequest, NextResponse } from 'next/server';
import { contactSchema, type ContactFormData } from '@/lib/schemas/contact';
import { getAllContacts, addContact, getContactCount } from '@/lib/contact-data';

export async function GET() {
  try {
    // Return all contacts (admin functionality)
    const contacts = getAllContacts();

    return NextResponse.json({
      success: true,
      data: contacts,
      count: getContactCount()
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body using Zod
    const validatedData = contactSchema.parse(body);

    // Save contact to file
    const contactEntry = addContact(validatedData);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: contactEntry.id,
        createdAt: contactEntry.createdAt,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error processing contact form:', error);

    if (error instanceof Error) {
      // Zod validation error
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}
