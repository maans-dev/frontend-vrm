import { FunctionComponent } from 'react';
import {
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiBreadcrumb,
  EuiCallOut,
  EuiPanel,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';
import { AiOutlineInfoCircle } from 'react-icons/ai';

interface Contact {
  structure: string;
  name: string;
  email: string;
}

const contactDetails = [
  {
    structure: 'Eastern Cape',
    name: 'Estelle Dell',
    email: 'estelledk@da.org.za',
  },
  {
    structure: 'Free State',
    name: 'Margie Oelschig',
    email: 'margieo@da.org.za',
  },
  {
    structure: 'Gauteng - GP North',
    name: 'Kamogelo Sithole',
    email: 'kamogelos@da.org.za',
  },
  {
    structure: 'Gauteng - GP West',
    name: 'Lucretia Olivier',
    email: 'lucretiao@da.org.za',
  },
  {
    structure: 'Gauteng - GP Vaal',
    name: 'Gertruida Verster',
    email: 'gertruidav@da.org.za',
  },
  {
    structure: 'Gauteng - Province',
    name: 'Chris Opperman',
    email: 'christiaano@da.org.za',
  },
  {
    structure: 'KwaZulu-Natal',
    name: 'Christopher Laubscher',
    email: 'director@dakzn.org.za',
  },
  {
    structure: 'Limpopo',
    name: 'Kendra Slabbert',
    email: 'kendras@da.org.za',
  },
  {
    structure: 'Mpumalanga',
    name: 'Stefan Smith',
    email: 'Stefans@da.org.za',
  },
  {
    structure: 'Northern Cape',
    name: 'Dominique Olivier',
    email: 'dominiqueo@da.org.za',
  },
  {
    structure: 'North West',
    name: 'Stefan Terblanche',
    email: 'stefant@da.org.za',
  },
  {
    structure: 'Western Cape - Metro',
    name: 'Berenice Lawrence',
    email: 'berrie@dawesterncape.org.za',
  },
  {
    structure: 'Western Cape - West',
    name: 'Tertia Duvenage',
    email: 'matzikama@dawesterncape.org.za',
  },
  {
    structure: 'Western Cape - East',
    name: 'Lucette Geldenhuys',
    email: 'lucette@dawesterncape.org.za',
  },
];

const Index: FunctionComponent = () => {
  const router = useRouter();
  const breadcrumb: EuiBreadcrumb[] = [
    {
      text: 'Home',
      href: '/',
      onClick: e => {
        router.push('/');
        e.preventDefault();
      },
    },
    {
      text: 'Support',
    },
  ];

  const columns: Array<EuiBasicTableColumn<Contact>> = [
    {
      field: 'structure',
      name: 'Province/Region',
      truncateText: false,
    },
    {
      field: 'name',
      name: 'Person',
      truncateText: false,
    },
    {
      field: 'email',
      name: 'Email',
      truncateText: false,
      render: (email: Contact['email']) => (
        <a
          href={`mailto:${email}?subject=VRM support request`}
          target="_blank"
          rel="noreferrer">
          {email}
        </a>
      ),
    },
  ];

  return (
    <MainLayout breadcrumb={breadcrumb} panelled={false}>
      <EuiPanel>
        <EuiText>
          <h1>Support</h1>

          <p>
            If you have questions or issues with this system please contact the
            designated VRM representative in your province or region. Their
            details are shown below. If they cannot assist, they will pass your
            questions on to the IT department at FHO.
          </p>

          <EuiCallOut
            size="m"
            title="If you are reporting an error or an issue, please supply the following
          information:"
            iconType={AiOutlineInfoCircle}>
            <ul>
              <li>Who you are – name and ID number.</li>
              <li>What you were trying to do on the system.</li>
              <li>What happened / what went wrong.</li>
              <li>Any error message that appeared on your screen.</li>
              <li>If possible, a screenshot that shows the issue.</li>
            </ul>
            <p>
              This will greatly assist us to efficiently resolve any issues.
            </p>
          </EuiCallOut>
        </EuiText>

        <EuiSpacer />

        <EuiBasicTable
          tableCaption="Demo of EuiBasicTable"
          items={contactDetails}
          rowHeader="firstName"
          columns={columns}
          // rowProps={getRowProps}
          // cellProps={getCellProps}
        />

        <EuiSpacer />
      </EuiPanel>
    </MainLayout>
  );
};

export default Index;
