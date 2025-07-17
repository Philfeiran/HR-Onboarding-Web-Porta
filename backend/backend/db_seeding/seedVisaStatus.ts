import { visaStatusModel } from '../src/models/visaStatus.model';

const sampleVisaStatusData = [
  {
    employeeId: 'emp001',
    employeeEmail: 'alice.johnson@example.com',
    optVisaStatus: {
      optReceipt: {
        id: 'doc001',
        fileName: 'OPT_Receipt_Alice.pdf',
        fileUrl: '/uploads/OPT_Receipt_Alice.pdf',
        uploadDate: new Date('2024-01-15'),
        status: 'pending' as const,
      },
      optEad: {
        id: 'doc002',
        fileName: 'OPT_EAD_Alice.pdf',
        fileUrl: '/uploads/OPT_EAD_Alice.pdf',
        uploadDate: new Date('2024-01-20'),
        status: 'pending' as const,
      },
      i983: {
        id: 'doc003',
        fileName: 'I983_Alice.pdf',
        fileUrl: '/uploads/I983_Alice.pdf',
        uploadDate: new Date('2024-01-25'),
        status: 'pending' as const,
      },
      i20: {
        id: 'doc004',
        fileName: 'I20_Alice.pdf',
        fileUrl: '/uploads/I20_Alice.pdf',
        uploadDate: new Date('2024-01-30'),
        status: 'pending' as const,
      },
    },
  },
  {
    employeeId: 'emp002',
    employeeEmail: 'david.lee@example.com',
    optVisaStatus: {
      optReceipt: {
        id: 'doc005',
        fileName: 'OPT_Receipt_David.pdf',
        fileUrl: '/uploads/OPT_Receipt_David.pdf',
        uploadDate: new Date('2024-02-01'),
        status: 'approved' as const,
        feedback: 'Document approved',
      },
      optEad: {
        id: 'doc006',
        fileName: 'OPT_EAD_David.pdf',
        fileUrl: '/uploads/OPT_EAD_David.pdf',
        uploadDate: new Date('2024-02-05'),
        status: 'pending' as const,
      },
      i983: {
        id: 'doc007',
        fileName: 'I983_David.pdf',
        fileUrl: '/uploads/I983_David.pdf',
        uploadDate: new Date('2024-02-10'),
        status: 'rejected' as const,
        feedback: 'Please provide additional information',
      },
      i20: {
        id: 'doc008',
        fileName: 'I20_David.pdf',
        fileUrl: '/uploads/I20_David.pdf',
        uploadDate: new Date('2024-02-15'),
        status: 'pending' as const,
      },
    },
  },
  {
    employeeId: 'emp003',
    employeeEmail: 'maria.gomez@example.com',
    optVisaStatus: {
      optReceipt: {
        id: 'doc009',
        fileName: 'OPT_Receipt_Maria.pdf',
        fileUrl: '/uploads/OPT_Receipt_Maria.pdf',
        uploadDate: new Date('2024-02-20'),
        status: 'pending' as const,
      },
      optEad: {
        id: 'doc010',
        fileName: 'OPT_EAD_Maria.pdf',
        fileUrl: '/uploads/OPT_EAD_Maria.pdf',
        uploadDate: new Date('2024-02-25'),
        status: 'pending' as const,
      },
      i983: {
        id: 'doc011',
        fileName: 'I983_Maria.pdf',
        fileUrl: '/uploads/I983_Maria.pdf',
        uploadDate: new Date('2024-03-01'),
        status: 'pending' as const,
      },
      i20: {
        id: 'doc012',
        fileName: 'I20_Maria.pdf',
        fileUrl: '/uploads/I20_Maria.pdf',
        uploadDate: new Date('2024-03-05'),
        status: 'pending' as const,
      },
    },
  },
];

export async function seedVisaStatus() {
  try {
    console.log('Starting visa status seeding...');
    for (const visaStatus of sampleVisaStatusData) {
      try {
        await visaStatusModel.createVisaStatus(visaStatus);
        console.log(`Created visa status for ${visaStatus.employeeEmail}`);
      } catch (error) {
        console.log(`Visa status for ${visaStatus.employeeEmail} already exists, skipping...`);
      }
    }
    console.log('Visa status seeding completed!');
  } catch (error) {
    console.error('Error seeding visa status:', error);
  }
}

if (require.main === module) {
  seedVisaStatus().then(() => {
    console.log('Visa status seeding finished');
    process.exit(0);
  }).catch((error) => {
    console.error('Visa status seeding failed:', error);
    process.exit(1);
  });
} 