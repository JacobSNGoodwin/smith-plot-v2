import { Title } from '@solidjs/meta';
import SmithChart from '~/components/SmithChart';

export default function Home() {
	return (
		<main>
			<Title>Smith Plot</Title>
			<div class="max-w-screen-2xl mx-auto">
				<h1 class="text-4xl font-bold text-center">Welcome to Smith Plot</h1>
				<SmithChart />
			</div>
		</main>
	);
}
