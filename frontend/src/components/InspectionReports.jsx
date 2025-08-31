import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  FileText, 
  Download, 
  Calendar, 
  Eye, 
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { inspectionApi } from '../services/api';

export const InspectionReports = ({ userData }) => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReport, setExpandedReport] = useState(null);

  useEffect(() => {
    loadReports();
  }, [userData.email]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const response = await inspectionApi.getOwnerReports(userData.email);
      if (response.success) {
        setReports(response.data);
      } else {
        setError('Failed to load inspection reports');
      }
    } catch (err) {
      console.error('Error loading inspection reports:', err);
      setError('Failed to load inspection reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = async (filename, title) => {
    try {
      const blob = await inspectionApi.downloadFile(filename);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading report:', err);
      alert('Failed to download report. Please try again.');
    }
  };

  const toggleReportExpansion = (reportId) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
  };

  if (isLoading) {
    return (
      <Card className="p-6 shadow-lg border-0 bg-white">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Loading inspection reports...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-lg border-0 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-900 flex items-center">
          <FileText className="h-6 w-6 mr-2 text-blue-600" />
          Inspection Reports
        </h3>
        <div className="text-sm text-slate-500">
          {reports.length} report{reports.length !== 1 ? 's' : ''} available
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {reports.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <FileText className="h-16 w-16 mx-auto mb-4 text-slate-300" />
          <h4 className="text-lg font-medium text-slate-700 mb-2">No Inspection Reports Yet</h4>
          <p className="text-slate-500 mb-4">
            Your property inspection reports will appear here once they're completed by our team.
          </p>
          <p className="text-sm text-slate-400">
            We'll notify you when new reports are available.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">{report.title}</h4>
                    <div className="flex items-center text-sm text-slate-600 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(report.inspectionDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        <span>Completed</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {report.reportFile && (
                      <Button
                        onClick={() => handleDownloadReport(report.reportFile, report.title)}
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                    <Button
                      onClick={() => toggleReportExpansion(report.id)}
                      variant="ghost"
                      size="sm"
                      className="flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {expandedReport === report.id ? 'Hide' : 'View'} Details
                    </Button>
                  </div>
                </div>
              </div>

              {expandedReport === report.id && (
                <div className="p-4 bg-white">
                  <div className="mb-4">
                    <h5 className="font-medium text-slate-900 mb-2">Inspection Notes:</h5>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {report.notes}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                    <div>
                      <span className="font-medium">Property:</span>
                      <p className="mt-1">{report.propertyAddress}</p>
                    </div>
                    <div>
                      <span className="font-medium">Report Created:</span>
                      <p className="mt-1">{new Date(report.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {report.reportFile && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-blue-800 font-medium">Detailed Report Available</span>
                        </div>
                        <Button
                          onClick={() => handleDownloadReport(report.reportFile, report.title)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-8 w-8 bg-blue-600 rounded-full">
              <Plus className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Need an Inspection?</h4>
            <p className="text-sm text-blue-700 mt-1">
              Contact our team to schedule a property inspection. We'll create a detailed report and upload it here for your review.
            </p>
            <div className="mt-3 flex space-x-4">
              <a
                href="tel:+18503309933"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Call (850) 330-9933
              </a>
              <a
                href="mailto:850realty@gmail.com"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};