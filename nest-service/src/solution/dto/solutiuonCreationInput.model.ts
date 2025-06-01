import { ApiProperty } from '@nestjs/swagger';

export class SolutionDetails {
  @ApiProperty({ description: 'Title of the solution details' })
  title: string;

  @ApiProperty({ description: 'Description of the solution details' })
  description: string;

  @ApiProperty({ description: 'Root cause of the problem' })
  rootCause: string;

  @ApiProperty({ description: 'Countermeasure for the solution' })
  countermeasure: string;
}

export class SolutionCreateInput {
  @ApiProperty({ description: 'The name of the solution' })
  name: string;

  @ApiProperty({ description: 'A brief description of the solution' })
  description: string;

  @ApiProperty({ description: 'The type or kind of the solution', default: 'simpleSolution' })
  kind: string = 'simpleSolution';

  @ApiProperty({ description: 'The location of the solution' })
  location: string;

  @ApiProperty({ description: 'The mode of the solution', default: 'createFromNew' })
  mode: string = 'createFromNew';

  @ApiProperty({ description: 'The status of the solution', default: 'draft' })
  status: string = 'draft';

  @ApiProperty({ description: 'ID of the default section', default: 'default-section-id' })
  defaultSectionId: string = 'default-section-id';

  @ApiProperty({ description: 'Name of the default section', default: 'Default Section' })
  defaultSectionName: string = 'Default Section';

  @ApiProperty({ description: 'ID of the default subsection', default: 'default-subsection-id' })
  defaultSubSectionId: string = 'default-subsection-id';

  @ApiProperty({ description: 'Name of the default subsection', default: 'Default Subsection' })
  defaultSubSectionName: string = 'Default Subsection';

  @ApiProperty({ description: 'ID of the default event', default: 'default-event-id' })
  defaultEventId: string = 'default-event-id';

  @ApiProperty({ description: 'Name of the default event', default: 'Default Event' })
  defaultEventName: string = 'Default Event';

  @ApiProperty({ description: 'Content related to the solution', default: '' })
  content: string = '';

  @ApiProperty({ description: 'The problem description' })
  problem: string;

  @ApiProperty({ description: 'Title of the problem' })
  title: string;

  @ApiProperty({ description: 'Email associated with the solution' })
  email: string;

  @ApiProperty({
    description: 'Details about the solution',
    type: SolutionDetails,
  })
  solutionDetails: SolutionDetails;
}
