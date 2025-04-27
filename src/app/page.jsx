
'use client';

import { ArrowDownWideNarrow, BookType, ChevronDown, ChevronUp, ListFilterPlus, NotebookPen } from 'lucide-react';
import { useState } from 'react';

const initialIncidents = [
  {
    id: 1,
    title: 'Biased Recommendation Algorithm',
    description: 'Algorithm consistently favored certain demographics...',
    severity: 'Medium',
    reported_at: '2025-03-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'LLM Hallucination in Critical Info',
    description: 'LLM provided incorrect safety procedure information...',
    severity: 'High',
    reported_at: '2025-04-01T14:30:00Z',
  },
  {
    id: 3,
    title: 'Minor Data Leak via Chatbot',
    description: 'Chatbot inadvertently exposed non-sensitive user metadata...',
    severity: 'Low',
    reported_at: '2025-03-20T09:15:00Z',
  },
];

export default function () {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [filter, setFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [expandedIds, setExpandedIds] = useState([]);
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    severity: 'Low',
  });

  const filteredIncidents = incidents
    .filter(incident => filter === 'All' || incident.severity === filter)
    .sort((a, b) => {
      const dateA = new Date(a.reported_at).getTime();
      const dateB = new Date(b.reported_at).getTime();
      return sortOrder === 'Newest' ? dateB - dateA : dateA - dateB;
    });

  const toggleExpand = (id) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newIncident.title.trim() || !newIncident.description.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    const newEntry = {
      id: incidents.length + 1,
      title: newIncident.title,
      description: newIncident.description,
      severity: newIncident.severity,
      reported_at: new Date().toISOString(),
    };

    setIncidents([newEntry, ...incidents]);
    setNewIncident({ title: '', description: '', severity: 'Low' });
    alert("Incident added")
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-16">
      <h1 className="text-3xl font-bold mb-4 text-center">AI Safety Incident Dashboard</h1>

      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <label htmlFor='fil' className='relative cursor-pointer'>
          <select
            id='fil'
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-[#7808d0] p-2 rounded shadow hover:shadow-md appearance-none pr-9 outline-none cursor-pointer"
          >
            <option value="All">All Severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <ListFilterPlus size={18} className='absolute top-1/2 -translate-y-1/2 right-2 pointer-events-none' />
        </label>

        <label htmlFor='sort' className='relative cursor-pointer'>
          <select
            id='sort'
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            className=" p-2 rounded shadow hover:shadow-md bg-[#7808d0] outline-none pr-9 appearance-none cursor-pointer"
          >
            <option value="Newest">Newest First</option>
            <option value="Oldest">Oldest First</option>
          </select>
          <ArrowDownWideNarrow size={18} className='absolute top-1/2 -translate-y-1/2 right-2 pointer-events-none cursor-pointer' />
        </label>
      </div>

      <div className="space-y-4">
        {filteredIncidents.map(incident => {
          const formattedDate = new Date(incident.reported_at).toISOString().split('T')[0];

          return (
            <div onClick={() => toggleExpand(incident.id)} key={incident.id} className="border border-[#1e1e1e] cursor-pointer select-none p-4 rounded-lg shadow hover:shadow-lg transition duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-medium">{incident.title}</h2>
                  <p className="text-sm text-gray-400">
                    Severity: <span className="font-bold">{incident.severity}</span> | Reported: {formattedDate}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(incident.id);
                  }}
                  className="transition-transform duration-300"
                >
                  <div
                    className={`transform transition-transform duration-300 ${expandedIds.includes(incident.id) ? 'rotate-180' : ''
                      }`}
                  >
                    <ChevronDown className="w-6 h-6" />
                  </div>
                </button>

              </div>
              <div
                className={`mt-2 text-gray-300 transition-all text-sm duration-500 ease-in-out overflow-hidden ${expandedIds.includes(incident.id) ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <p>{incident.description}</p>
              </div>

            </div>
          );
        })}

      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center">Report New Incident</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className='relative'>
            <BookType size={18} className='absolute top-1/2 -translate-y-1/2 left-2 text-gray-500' />
            <input
              type="text"
              placeholder="Title"
              value={newIncident.title}
              onChange={e => setNewIncident({ ...newIncident, title: e.target.value })}
              className="w-full border border-[#1e1e1e] p-2 pl-9 rounded shadow hover:shadow-md outline-none"
            />
          </div>
          <div className='relative'>
            <NotebookPen size={18} className='absolute top-3 left-2 text-gray-500' />
            <textarea
              placeholder="Description"
              value={newIncident.description}
              onChange={e => setNewIncident({ ...newIncident, description: e.target.value })}
              className="w-full border border-[#1e1e1e] resize-none p-2 pl-9 rounded shadow hover:shadow-md outline-none"
              rows={4}
            />
          </div>
          <select
            value={newIncident.severity}
            onChange={e => setNewIncident({ ...newIncident, severity: e.target.value })}
            className="w-full border border-[#1e1e1e] p-2 rounded shadow hover:shadow-md outline-none "
          >
            <option className='text-white bg-black' value="Low">Low</option>
            <option className='text-white bg-black' value="Medium">Medium</option>
            <option className='text-whitw bg-black' value="High">High</option>
          </select>
          <div className='flex justify-center'>
            <button
              type="submit"
              className="bg-[#7808d0]  py-3 px-5 rounded-full cursor-pointer hover:bg-[#7908d0d8]"
            >
              Submit Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
