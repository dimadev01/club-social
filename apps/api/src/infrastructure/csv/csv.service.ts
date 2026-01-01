/**
 * Created by Claude Opus 4.5
 * Date: 2025-12-22
 */
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

export interface CsvColumn<T> {
  accessor: (row: T) => null | number | string | undefined;
  header: string;
}

@Injectable()
export class CsvService {
  /**
   * Generates a CSV as a readable stream from an array of data.
   * Handles special characters, quotes, and newlines properly per RFC 4180.
   */
  public generateStream<T>(data: T[], columns: CsvColumn<T>[]): Readable {
    const headers = columns.map((col) => this.escapeCell(col.header)).join(',');

    const rows = data.map((row) =>
      columns
        .map((col) => {
          const value = col.accessor(row);

          return this.escapeCell(value?.toString() ?? '');
        })
        .join(','),
    );

    const csvContent = [headers, ...rows].join('\n');

    return Readable.from([csvContent]);
  }

  /**
   * Escapes a CSV cell value according to RFC 4180.
   * Wraps in quotes if contains comma, quote, or newline.
   */
  private escapeCell(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }

    return value;
  }
}
