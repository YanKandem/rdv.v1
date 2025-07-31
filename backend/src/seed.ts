import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { AppointmentType } from '../models/AppointmentType';
import { AppointmentForm } from '../models/AppointmentForm';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myrdv';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await AppointmentType.deleteMany({});
    await AppointmentForm.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Administrateur',
      email: 'admin@myrdv.com',
      password: adminPassword,
      role: 'admin'
    });
    await adminUser.save();
    console.log('Created admin user: admin@myrdv.com / admin123');

    // Create sample appointment types
    const visaAppointmentType = new AppointmentType({
      name: 'Demande de Visa Touristique',
      duration: 30,
      description: 'Rendez-vous pour une demande de visa touristique - Durée: 30 minutes',
      active: true
    });
    await visaAppointmentType.save();

    const passportAppointmentType = new AppointmentType({
      name: 'Renouvellement de Passeport',
      duration: 45,
      description: 'Rendez-vous pour le renouvellement de passeport - Durée: 45 minutes',
      active: true
    });
    await passportAppointmentType.save();

    const citizenshipAppointmentType = new AppointmentType({
      name: 'Demande de Naturalisation',
      duration: 60,
      description: 'Entretien pour demande de naturalisation - Durée: 1 heure',
      active: true
    });
    await citizenshipAppointmentType.save();

    console.log('Created appointment types');

    // Create sample forms
    const visaForm = new AppointmentForm({
      title: 'Formulaire de demande de visa touristique',
      description: 'Veuillez remplir toutes les informations requises pour votre demande de visa.',
      appointmentType: 'Demande de Visa Touristique',
      status: 'published',
      createdBy: adminUser._id,
      fields: [
        {
          id: 'nom',
          type: 'text',
          label: 'Nom de famille',
          required: true,
          placeholder: 'Entrez votre nom de famille'
        },
        {
          id: 'prenom',
          type: 'text',
          label: 'Prénom(s)',
          required: true,
          placeholder: 'Entrez votre/vos prénom(s)'
        },
        {
          id: 'email',
          type: 'email',
          label: 'Adresse email',
          required: true,
          placeholder: 'votre.email@exemple.com'
        },
        {
          id: 'telephone',
          type: 'phone',
          label: 'Numéro de téléphone',
          required: true,
          placeholder: '+33 1 23 45 67 89'
        },
        {
          id: 'nationalite',
          type: 'select',
          label: 'Nationalité',
          required: true,
          options: ['Française', 'Belge', 'Suisse', 'Canadienne', 'Autre']
        },
        {
          id: 'date_naissance',
          type: 'date',
          label: 'Date de naissance',
          required: true
        },
        {
          id: 'duree_sejour',
          type: 'select',
          label: 'Durée du séjour prévue',
          required: true,
          options: ['Moins de 1 semaine', '1-2 semaines', '2-4 semaines', '1-3 mois', 'Plus de 3 mois']
        },
        {
          id: 'motif_voyage',
          type: 'textarea',
          label: 'Motif du voyage',
          required: true,
          placeholder: 'Décrivez le motif de votre voyage...'
        }
      ]
    });
    await visaForm.save();

    const passportForm = new AppointmentForm({
      title: 'Formulaire de renouvellement de passeport',
      description: 'Informations nécessaires pour le renouvellement de votre passeport.',
      appointmentType: 'Renouvellement de Passeport',
      status: 'published',
      createdBy: adminUser._id,
      fields: [
        {
          id: 'nom',
          type: 'text',
          label: 'Nom de famille',
          required: true
        },
        {
          id: 'prenom',
          type: 'text',
          label: 'Prénom(s)',
          required: true
        },
        {
          id: 'email',
          type: 'email',
          label: 'Adresse email',
          required: true
        },
        {
          id: 'telephone',
          type: 'phone',
          label: 'Numéro de téléphone',
          required: true
        },
        {
          id: 'numero_passeport_actuel',
          type: 'text',
          label: 'Numéro du passeport actuel',
          required: true,
          placeholder: 'Ex: 12AB34567'
        },
        {
          id: 'date_expiration',
          type: 'date',
          label: 'Date d\'expiration du passeport actuel',
          required: true
        },
        {
          id: 'urgence',
          type: 'radio',
          label: 'Demande urgente',
          required: true,
          options: ['Oui', 'Non']
        },
        {
          id: 'motif_urgence',
          type: 'textarea',
          label: 'Motif de l\'urgence (si applicable)',
          required: false,
          placeholder: 'Expliquez pourquoi cette demande est urgente...'
        }
      ]
    });
    await passportForm.save();

    // Update appointment types with form IDs
    visaAppointmentType.formId = visaForm._id;
    await visaAppointmentType.save();

    passportAppointmentType.formId = passportForm._id;
    await passportAppointmentType.save();

    console.log('Created sample forms and linked to appointment types');

    console.log('\n=== SEED DATA CREATED SUCCESSFULLY ===');
    console.log('Admin credentials:');
    console.log('Email: admin@myrdv.com');
    console.log('Password: admin123');
    console.log('\nAppointment types created: 3');
    console.log('Forms created: 2');
    console.log('=====================================\n');

  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedData();