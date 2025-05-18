import * as XLSX from 'xlsx';

export async function exportToExcel(
  data: any[],
  fileName: string = 'download_murunmo_data'
): Promise<boolean> {
  try {
    // Validate data
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid data format for Excel export');
    }

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Auto-size columns
    const max_width = data.reduce(
      (w, r) => Math.max(w, Object.keys(r).length),
      0
    );
    const colWidths = new Array(max_width).fill({ wch: 15 });
    worksheet['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);

    return true;
  } catch (error) {
    return false;
  }
}
