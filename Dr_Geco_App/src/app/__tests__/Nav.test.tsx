import Nav from "../components/Nav";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

describe('Navbar',()=>{
    test('test render content', ()=>{
        render(<Nav />);
        expect(screen.getByText('For Work')).toBeInTheDocument();
        expect(screen.getByTestId('logo')).toBeInTheDocument();
        expect(screen.getByText('Why Dr. Geco')).toBeInTheDocument();
        expect(screen.getByText('For Education')).toBeInTheDocument();
        expect(screen.getByText('Compare Plans')).toBeInTheDocument();
    })
    test('test links',()=>{
        render(<Nav />);
        expect(screen.getByText("Get Dr. Geco it's free")).toHaveAttribute('href', '/register')
        expect(screen.getByText("Log in")).toHaveAttribute('href', '/login')
        expect(screen.getByText("Dr. Geco")).toHaveAttribute('href', '/')
    })
})