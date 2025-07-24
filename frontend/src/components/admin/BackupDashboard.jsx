import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  HardDrive,
  Database,
  FileArchive,
  Image,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Shield,
  Server,
  Cloud,
  Calendar,
  Play,
  Loader2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Card, Button } from '../common';

const StatCard = ({ icon: Icon, label, value, color = 'blue', subtext }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        {subtext && (
          <p className="mt-1 text-sm text-gray-500">{subtext}</p>
        )}
      </div>
      <div className={`p-3 bg-${color}-100 rounded-lg`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
  </Card>
);

const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const BackupDashboard = ({ status, config, onRunBackup, isBackupRunning }) => {
  const { t } = useTranslation();
  const lastBackup = status?.lastBackup;
  const statistics = lastBackup?.statistics || {};
  const isConfigured = config && config.backup_destination_type;
  const isEnabled = config?.backup_enabled;

  // Calculate backup health score
  const getHealthScore = () => {
    if (!lastBackup) return { score: 0, status: 'critical', message: t('backup.dashboard.healthMessages.noBackups') };
    
    const hoursSinceBackup = (Date.now() - new Date(lastBackup.created_at)) / (1000 * 60 * 60);
    
    if (lastBackup.status === 'failed') {
      return { score: 0, status: 'critical', message: t('backup.dashboard.healthMessages.lastBackupFailed') };
    }
    
    if (hoursSinceBackup < 24) {
      return { score: 100, status: 'excellent', message: t('backup.dashboard.healthMessages.upToDate') };
    } else if (hoursSinceBackup < 48) {
      return { score: 75, status: 'good', message: t('backup.dashboard.healthMessages.recent') };
    } else if (hoursSinceBackup < 168) { // 1 week
      return { score: 50, status: 'warning', message: t('backup.dashboard.healthMessages.gettingOld') };
    } else {
      return { score: 25, status: 'critical', message: t('backup.dashboard.healthMessages.outdated') };
    }
  };

  const health = getHealthScore();
  const healthColors = {
    excellent: 'green',
    good: 'blue',
    warning: 'amber',
    critical: 'red'
  };

  return (
    <div className="space-y-6">
      {/* Configuration Alert */}
      {!isConfigured && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                {t('backup.dashboard.notConfigured.title')}
              </h3>
              <p className="mt-1 text-sm text-amber-700">
                {t('backup.dashboard.notConfigured.message')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Health Score Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{t('backup.dashboard.health.title')}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${healthColors[health.status]}-100 text-${healthColors[health.status]}-700`}>
            {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="48"
                cy="48"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(health.score / 100) * 226} 226`}
                className={`text-${healthColors[health.status]}-500`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{health.score}%</span>
            </div>
          </div>
          
          <div className="flex-1">
            <p className="text-gray-700 font-medium">{health.message}</p>
            {lastBackup && (
              <p className="text-sm text-gray-500 mt-1">
                Last successful backup: {formatDistanceToNow(new Date(lastBackup.created_at), { addSuffix: true })}
              </p>
            )}
            
            <Button
              onClick={onRunBackup}
              disabled={!isConfigured || !isEnabled || isBackupRunning}
              className="mt-3"
              size="sm"
            >
              {isBackupRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('backup.dashboard.actions.running')}
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  {t('backup.dashboard.actions.runBackupNow')}
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FileArchive}
          label={t('backup.dashboard.stats.totalBackups')}
          value={status?.totalBackups || 0}
          color="blue"
          subtext={lastBackup ? `${t('backup.dashboard.stats.last')}: ${format(new Date(lastBackup.created_at), 'PP')}` : t('backup.dashboard.stats.noBackupsYet')}
        />
        
        <StatCard
          icon={HardDrive}
          label={t('backup.dashboard.stats.backupSize')}
          value={formatBytes(statistics.total_size || 0)}
          color="green"
          subtext={`${statistics.files_processed || 0} ${t('backup.dashboard.stats.files')}`}
        />
        
        <StatCard
          icon={Clock}
          label={t('backup.dashboard.stats.lastDuration')}
          value={lastBackup ? `${Math.round(lastBackup.duration_seconds / 60)}m` : 'N/A'}
          color="purple"
          subtext={lastBackup ? format(new Date(lastBackup.created_at), 'p') : ''}
        />
        
        <StatCard
          icon={Shield}
          label={t('backup.dashboard.stats.backupStatus')}
          value={isEnabled ? t('backup.dashboard.stats.active') : t('backup.dashboard.stats.inactive')}
          color={isEnabled ? 'green' : 'gray'}
          subtext={config?.backup_destination_type || t('backup.dashboard.notConfigured.title')}
        />
      </div>

      {/* Recent Activity */}
      {status?.recentBackups && status.recentBackups.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('backup.dashboard.recentActivity.title')}</h3>
          <div className="space-y-3">
            {status.recentBackups.slice(0, 5).map((backup) => (
              <div key={backup.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  {backup.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : backup.status === 'failed' ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {t('backup.dashboard.backupType', { type: backup.backup_type })}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(backup.created_at), 'PPp')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatBytes(backup.statistics?.total_size || 0)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {backup.statistics?.files_processed || 0} files
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Storage Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('backup.dashboard.coverage.title')}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">Database</span>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                statistics.database_backed_up ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {statistics.database_backed_up ? t('backup.dashboard.coverage.included') : t('backup.dashboard.coverage.excluded')}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Image className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{t('backup.configuration.whatToBackup.photos')}</span>
              </div>
              <span className="text-sm text-gray-500">
                {statistics.photos_backed_up || 0} {t('common.of')} {statistics.total_photos || 0}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileArchive className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{t('backup.configuration.whatToBackup.archives')}</span>
              </div>
              <span className="text-sm text-gray-500">
                {statistics.archives_backed_up || 0} {t('backup.dashboard.stats.files')}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('backup.dashboard.storageDestination')}</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              {config?.backup_destination_type === 's3' ? (
                <Cloud className="h-5 w-5 text-blue-500" />
              ) : config?.backup_destination_type === 'rsync' ? (
                <Server className="h-5 w-5 text-purple-500" />
              ) : (
                <HardDrive className="h-5 w-5 text-gray-500" />
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {config?.backup_destination_type 
                    ? t(`backup.configuration.destinationTypes.${config.backup_destination_type}.name`) 
                    : t('backup.dashboard.notConfigured.title')}
                </p>
                <p className="text-sm text-gray-500">
                  {config?.backup_destination_type === 's3' && config?.backup_s3_bucket
                    ? `Bucket: ${config.backup_s3_bucket}`
                    : config?.backup_destination_type === 'local' && config?.backup_destination_path
                    ? `Path: ${config.backup_destination_path}`
                    : config?.backup_destination_type === 'rsync' && config?.backup_rsync_host
                    ? `Host: ${config.backup_rsync_host}`
                    : t('backup.dashboard.noDestinationSet')}
                </p>
              </div>
            </div>
            
            {config?.backup_retention_days && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {t('backup.configuration.schedule.retentionDays')} {config.backup_retention_days} {t('backup.configuration.schedule.retentionHelp').replace('days (older backups will be automatically deleted)', '')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};