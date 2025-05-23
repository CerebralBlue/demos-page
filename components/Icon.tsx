import { XCircleIcon, HomeIcon, LinkIcon, ChartBarIcon, UsersIcon, DocumentChartBarIcon, DocumentArrowUpIcon, CommandLineIcon, TableCellsIcon, DocumentIcon, PaperAirplaneIcon, PencilSquareIcon, ArrowPathIcon, PencilIcon, ArrowDownTrayIcon, ArrowTrendingUpIcon, EyeIcon, DocumentTextIcon, ChatBubbleBottomCenterIcon, TrashIcon, PaperClipIcon, MicrophoneIcon, MoonIcon, SunIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon, PlayIcon, Bars3Icon, ArrowsRightLeftIcon, InformationCircleIcon, ChevronDoubleDownIcon, ChevronUpIcon, DocumentMagnifyingGlassIcon, LanguageIcon} from '@heroicons/react/24/outline';
import { BriefcaseIcon, CalculatorIcon, ChevronDownIcon, ComputerIcon, GlobeIcon, HeartIcon, IdCardIcon, ImageIcon, SearchIcon, TrainIcon } from 'lucide-react';

const Icon = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case 'home':
      return <HomeIcon className={className} />;
    case 'link':
      return <LinkIcon className={className} />;
    case 'char-bar':
      return <ChartBarIcon className={className} />;
    case 'users':
      return <UsersIcon className={className} />;
    case 'document':
      return <DocumentIcon className={className} />;
    case 'document-chart-bar':
      return <DocumentChartBarIcon className={className} />;
    case 'document-arrow-up':
      return <DocumentArrowUpIcon className={className} />;
    case 'document-text':
      return <DocumentTextIcon className={className} />;
    case 'command-line':
      return <CommandLineIcon className={className} />;
    case 'table-cells':
      return <TableCellsIcon className={className} />;
    case 'x-circle':
      return <XCircleIcon className={className} />;
    case 'paper-plane':
      return <PaperAirplaneIcon className={className} />;
    case 'pencil':
      return <PencilIcon className={className} />;
    case 'arrow-trending-up':
      return <ArrowTrendingUpIcon className={className} />;
    case 'pencil-square':
      return <PencilSquareIcon className={className} />;
    case 'loader':
      return <ArrowPathIcon className={className} />;
    case 'edit':
      return <PencilIcon className={className} />;
    case 'arrow-down-tray':
      return <ArrowDownTrayIcon className={className} />;
    case 'arrow-left':
      return <ArrowLeftIcon className={className} />;
    case 'arrow-right':
      return <ArrowRightIcon className={className} />;
    case 'arrow-right-left':
      return <ArrowsRightLeftIcon className={className} />;
    case 'eye':
      return <EyeIcon className={className} />;
    case 'chat-bubble-bottom-center-text':
      return <ChatBubbleBottomCenterIcon className={className} />;
    case 'trash':
      return <TrashIcon className={className} />;
    case 'paper-clip':
      return <PaperClipIcon className={className} />;
    case 'check':
      return <CheckIcon className={className} />;
    case 'microphone':
      return <MicrophoneIcon className={className} />;
    case 'sun':
      return <SunIcon className={className} />;
    case 'moon':
      return <MoonIcon className={className} />;
    case 'swap':
      return <ArrowPathIcon className={className} />;
    case 'play':
      return <PlayIcon className={className} />;
    case 'bars-3':
      return <Bars3Icon className={className} />;
    case 'info':
      return <InformationCircleIcon className={className} />;
    case 'chevron-down':
      return <ChevronDownIcon className={className} />;
    case 'chevron-up':
      return <ChevronUpIcon className={className} />;
    case 'card':
      return <IdCardIcon className={className} />;
    case 'computer':
      return <ComputerIcon className={className} />;
    case 'search':
      return <SearchIcon className={className} />;
    case 'image':
      return <ImageIcon className={className} />;
    case 'calculator':
      return <CalculatorIcon className={className} />;
    case 'briefcase':
      return <BriefcaseIcon className={className} />;
    case 'globe':
      return <GlobeIcon className={className} />;
    case 'heart':
      return <HeartIcon className={className} />;
    case 'train':
      return <TrainIcon className={className} />;
    case 'document-magnifying-glass':
      return <DocumentMagnifyingGlassIcon className={className} />;
    case 'language':
      return <LanguageIcon className={className} />;
    default:
      return null;
  }
};

export default Icon;
