/**
 * AnalyticsDashboard Component
 * Enhanced analytics dashboard with charts and metrics
 */

import { useState, useEffect, useMemo } from 'react';
import { BarChart3, Users, TrendingUp, Calendar, Award } from 'lucide-react';
import Card from './ui/Card';
import { useAnalytics } from '../hooks/useSupabase';

function AnalyticsDashboard({ event }) {
  const { 
    getSignupsByDate, 
    getTeamsByDate, 
    getParticipationByRole, 
    getUserEngagement,
    loading,
    error 
  } = useAnalytics();

  const [signupsData, setSignupsData] = useState({});
  const [teamsData, setTeamsData] = useState({});
  const [roleData, setRoleData] = useState({});
  const [engagementData, setEngagementData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [signups, teams, roles, engagement] = await Promise.all([
        getSignupsByDate(),
        getTeamsByDate(event?.id),
        getParticipationByRole(),
        getUserEngagement(),
      ]);

      if (signups.data) setSignupsData(signups.data);
      if (teams.data) setTeamsData(teams.data);
      if (roles.data) setRoleData(roles.data);
      if (engagement.data) setEngagementData(engagement.data);
    };

    if (event?.id) {
      fetchData();
    }
  }, [event?.id, getSignupsByDate, getTeamsByDate, getParticipationByRole, getUserEngagement]);

  // Format data for display
  const signupsChartData = useMemo(() => {
    return Object.entries(signupsData)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days
  }, [signupsData]);

  const teamsChartData = useMemo(() => {
    return Object.entries(teamsData)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days
  }, [teamsData]);

  const roleChartData = useMemo(() => {
    return Object.entries(roleData).map(([role, count]) => ({
      role: role.charAt(0).toUpperCase() + role.slice(1),
      count,
    }));
  }, [roleData]);

  const exportAnalytics = () => {
    const csvRows = [];
    csvRows.push(['Metric', 'Value'].join(','));

    // Signups
    csvRows.push(['Signups by Date', ''].join(','));
    signupsChartData.forEach(({ date, count }) => {
      csvRows.push([date, count].join(','));
    });

    // Teams
    csvRows.push(['', ''].join(','));
    csvRows.push(['Teams by Date', ''].join(','));
    teamsChartData.forEach(({ date, count }) => {
      csvRows.push([date, count].join(','));
    });

    // Roles
    csvRows.push(['', ''].join(','));
    csvRows.push(['Participation by Role', ''].join(','));
    roleChartData.forEach(({ role, count }) => {
      csvRows.push([role, count].join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `hackday-2026-analytics-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
        <p className="text-arena-secondary">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-error">
        <p className="text-error">Error loading analytics: {error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Engagement Metrics */}
      {engagementData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <Users className="w-8 h-8 text-brand mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{engagementData.usersOnTeams}</div>
            <div className="text-xs text-arena-secondary">Users on Teams</div>
          </Card>
          <Card className="text-center">
            <Award className="w-8 h-8 text-brand mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{engagementData.usersWhoVoted}</div>
            <div className="text-xs text-arena-secondary">Users Who Voted</div>
          </Card>
          <Card className="text-center">
            <TrendingUp className="w-8 h-8 text-brand mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{engagementData.usersWhoSubmitted}</div>
            <div className="text-xs text-arena-secondary">Users Who Submitted</div>
          </Card>
          <Card className="text-center">
            <BarChart3 className="w-8 h-8 text-brand mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{engagementData.totalUsers}</div>
            <div className="text-xs text-arena-secondary">Total Active Users</div>
          </Card>
        </div>
      )}

      {/* Signups Over Time */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Signups Over Time
          </h3>
          <button
            type="button"
            onClick={exportAnalytics}
            className="px-3 py-1 text-xs font-bold text-brand hover:text-brand/80"
          >
            Export CSV
          </button>
        </div>
        {signupsChartData.length > 0 ? (
          <div className="space-y-2">
            {signupsChartData.map(({ date, count }) => (
              <div key={date} className="flex items-center gap-3">
                <div className="w-24 text-xs text-arena-secondary">{date}</div>
                <div className="flex-1 bg-arena-elevated rounded-full h-6 relative overflow-hidden">
                  <div
                    className="bg-brand h-full rounded-full transition-all"
                    style={{ width: `${(count / Math.max(...signupsChartData.map(d => d.count))) * 100}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-arena-secondary text-sm">No signup data available</p>
        )}
      </Card>

      {/* Teams Created Over Time */}
      <Card>
        <h3 className="font-bold text-white flex items-center gap-2 mb-4">
          <Users className="w-5 h-5" />
          Teams Created Over Time
        </h3>
        {teamsChartData.length > 0 ? (
          <div className="space-y-2">
            {teamsChartData.map(({ date, count }) => (
              <div key={date} className="flex items-center gap-3">
                <div className="w-24 text-xs text-arena-secondary">{date}</div>
                <div className="flex-1 bg-arena-elevated rounded-full h-6 relative overflow-hidden">
                  <div
                    className="bg-violet h-full rounded-full transition-all"
                    style={{ width: `${(count / Math.max(...teamsChartData.map(d => d.count), 1)) * 100}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-arena-secondary text-sm">No team data available</p>
        )}
      </Card>

      {/* Participation by Role */}
      <Card>
        <h3 className="font-bold text-white flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5" />
          Participation by Role
        </h3>
        {roleChartData.length > 0 ? (
          <div className="space-y-3">
            {roleChartData.map(({ role, count }) => {
              const total = roleChartData.reduce((sum, r) => sum + r.count, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              
              return (
                <div key={role}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white">{role}</span>
                    <span className="text-sm text-arena-secondary">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="bg-arena-elevated rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-brand h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-arena-secondary text-sm">No role data available</p>
        )}
      </Card>
    </div>
  );
}

export default AnalyticsDashboard;
