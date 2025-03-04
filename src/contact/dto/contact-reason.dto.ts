import { ApiProperty } from '@nestjs/swagger';
import { ContactReasonType } from '../enums/contact-reason.enum';

export class ContactReasonDto {
    @ApiProperty({ example: 'BUG_REPORT', description: 'The reason identifier' })
    value: ContactReasonType;

    @ApiProperty({ example: 'Report a Bug', description: 'Human-readable label for the reason' })
    label: string;

    @ApiProperty({ example: 'Submit a bug report to help us improve the app', description: 'Description of the contact reason' })
    description: string;
}

// Map of contact reasons with their user-friendly labels and descriptions
export const CONTACT_REASONS_MAP = new Map<ContactReasonType, Omit<ContactReasonDto, 'value'>>([
    [ContactReasonType.GENERAL_INQUIRY, {
        label: 'General Inquiry',
        description: 'General questions about our services or platform'
    }],
    [ContactReasonType.BUG_REPORT, {
        label: 'Report a Bug',
        description: 'Report a technical issue or bug you encountered'
    }],
    [ContactReasonType.FEATURE_REQUEST, {
        label: 'Feature Request',
        description: 'Suggest a new feature or improvement'
    }],
    [ContactReasonType.ACCOUNT_ISSUE, {
        label: 'Account Issue',
        description: 'Problems with your account or access'
    }],
    [ContactReasonType.SECURITY_CONCERN, {
        label: 'Security Concern',
        description: 'Report a security vulnerability or concern'
    }],
    [ContactReasonType.BILLING_QUESTION, {
        label: 'Billing Question',
        description: 'Questions about billing, payments, or subscriptions'
    }],
    [ContactReasonType.OTHER, {
        label: 'Other',
        description: 'Other inquiries not covered by the categories above'
    }]
]); 