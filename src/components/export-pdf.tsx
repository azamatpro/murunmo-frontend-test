'use client';

import { User } from '@/constants/mock-api';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles for PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30
  },
  header: {
    marginBottom: 20,
    fontSize: 24,
    textAlign: 'center'
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row'
  },
  tableHeader: {
    backgroundColor: '#f4f4f4',
    fontWeight: 'bold'
  },
  tableCell: {
    width: '12.5%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 10
  }
});

interface UsersPdfDocumentProps {
  data: User[];
}

export default function UsersPdfDocument({ data }: UsersPdfDocumentProps) {
  return (
    <Document>
      <Page size='A4' orientation='landscape' style={styles.page}>
        <Text style={styles.header}>Users Report</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>ID</Text>
            <Text style={styles.tableCell}>Name</Text>
            <Text style={styles.tableCell}>Username</Text>
            <Text style={styles.tableCell}>Department</Text>
            <Text style={styles.tableCell}>Position</Text>
            <Text style={styles.tableCell}>Phone Number</Text>
            <Text style={styles.tableCell}>Business Date</Text>
            <Text style={styles.tableCell}>Admin Status</Text>
          </View>

          {/* Table Body */}
          {data.map((user) => (
            <View key={user.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{user.id}</Text>
              <Text style={styles.tableCell}>{user.name}</Text>
              <Text style={styles.tableCell}>{user.username}</Text>
              <Text style={styles.tableCell}>{user.department}</Text>
              <Text style={styles.tableCell}>{user.position}</Text>
              <Text style={styles.tableCell}>{user.phoneNumber}</Text>
              <Text style={styles.tableCell}>{user.businessDate}</Text>
              <Text style={styles.tableCell}>
                {user.isAdmin ? 'Yes' : 'No'}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
