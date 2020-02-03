import * as assert from 'assert';
import {RemoteClass, RemoteBreakpoint, GenericBreakpoint, GenericWatchpoint} from '../remoteclass';
import {Z80Registers} from '../z80registers';
//import {MemoryPage} from '../remoteclass';
import * as SerialPort from 'serialport';
import {ZxNextParser} from './zxnextusbserial';
//const SerialPort=require('serialport')

/**
 * The representation of the ZX Next HW.
 * It receives the requests from the DebugAdapter and communicates with
 * the USB serial connection with the ZX Next HW.
 */
export class ZxNextRemote extends RemoteClass {

	// The serial port. https://serialport.io/docs/guide-usage
	public serialPort;


	/// Constructor.
	/// Override this.
	constructor() {
		super();
		// Instantiate the registers
		this.z80Registers=new Z80Registers();
	}


	/// Initializes the machine.
	/// When ready it emits this.emit('initialized') or this.emit('error', exception);
	public init() {
		super.init();

		// Open the serial port
		this.serialPort=new SerialPort("/dev/cu.usbserial", {
			baudRate: 115200, autoOpen: false
		});

		// Create parser
		const parser=this.serialPort.pipe(new ZxNextParser());

		// Install listener
		parser.on('data', data => {
			this.receivedMsg(data);
		});

		// React on-open
		this.serialPort.on('open', () => {
			console.log('Open');
		});

		// Handle errors
		this.serialPort.on('error', err => {
			console.log('Error: ', err.message);
		});

		// Open the serial port
		this.serialPort.open(() => {
			console.log('Open');
			this.serialPort.write('Hello Serial\n');
			this.serialPort.write('2-mal\n');
		});


		// Fake 'Ready'
	//	this.emit('initialized');
	}


	/**
	 * Called when new data was received through the serial interface.
	 * @param data The received block of bytes.
	 */
	protected receivedMsg(data: any) {

	}


	/**
	* If cache is empty retrieves the registers from
	* the emulator.
	* Override.
	*/
	public async getRegisters(): Promise<void> {
		//assert(false);
		// PC=8122h
		const regData=Z80Registers.getRegisterData(0x8122, 0x8418,
			0, 0, 0, 0,
			0, 0,
			0, 0, 0, 0,
			0, 0);
		this.z80Registers.setCache(regData);
	}


	/**
	 * Sets the value for a specific register.
	 * Reads the value from the emulator and returns it in the promise.
	 * Note: if in reverse debug mode the function should do nothing and the promise should return the previous value.
	 * @param register The register to set, e.g. "BC" or "A'". Note: the register name has to exist. I.e. it should be tested before.
	 * @param value The new register value.
	 * @return Promise with the "real" register value.
	 */
	public async setRegisterValue(register: string, value: number): Promise<number> {
		//assert(false);	// override this
		return 0;
	}


	/**
	 * 'continue' debugger program execution.
	 * @returns A Promise with {reason, tStates, cpuFreq}.
	 * Is called when it's stopped e.g. when a breakpoint is hit.
	 * reason contains the stop reason as string.
	 * tStates contains the number of tStates executed.
	 * cpuFreq contains the CPU frequency at the end.
	 */
	public async continue(): Promise<{reason: string, tStates?: number, cpuFreq?: number}> {
		assert(false);	// override this
		return {reason: ""};
	}


	/**
	 * 'pause' the debugger.
	 */
	public pause(): void {
		assert(false);	// override this
	}


	/**
	 * 'step over' an instruction in the debugger.
	 * @returns A Promise with:
	 * 'instruction' is the disassembly of the current line.
	 * 'tStates' contains the number of tStates executed.
	 * 'cpuFreq' contains the CPU frequency at the end.
	 * 'breakReason' a possibly text with the break reason.
	 */
	public async stepOver(): Promise<{instruction: string, tStates?: number, cpuFreq?: number, breakReason?: string}> {
		assert(false);	// override this
		return {
			instruction: ""
		};
	}


	/**
	 * 'step into' an instruction in the debugger.
	 * @returns A Promise:
	 * 'instruction' is the disassembly of the current line.
	 * 'tStates' contains the number of tStates executed.
	 * 'cpuFreq' contains the CPU frequency at the end.
	 * 'breakReason' a possibly text with the break reason. This is mainly to keep the
	 * record consistent with stepOver. But it is e.g. used to inform when the
	 * end of the cpu history is reached.
	 */
	public async stepInto(): Promise<{instruction: string, tStates?: number, cpuFreq?: number, breakReason?: string}> {
		assert(false);	// override this
		return {
			instruction: ""
		};
	}


	/**
	 * 'step out' of current subroutine.
	 * @param A Promise that returns {tStates, cpuFreq, breakReason}
	 * 'tStates' contains the number of tStates executed.
	 * 'cpuFreq' contains the CPU frequency at the end.
	 * 'breakReason' a possibly text with the break reason.
	 */
	public async stepOut(): Promise<{tStates?: number, cpuFreq?: number, breakReason?: string}> {
		assert(false);	// override this
		return {};
	}


	/**
	 * Enables/disables all WPMEM watchpoints set from the sources.
	 * Promise is called when method finishes.
	 * @param enable true=enable, false=disable.
	 */
	public async enableWPMEM(enable: boolean): Promise<void> {
		assert(false);	// override this
	}


	/**
	 * Sets the watchpoints in the given list.
	 * Watchpoints result in a break in the program run if one of the addresses is written or read to.
	 * Promises is execute when last watchpoint has been set.
	 * @param watchPoints A list of addresses to put a guard on.
	 */
	public async setWatchpoints(watchPoints: Array<GenericWatchpoint>): Promise<void> {
		assert(false);	// override this
	}


	/**
	 * Set all assert breakpoints.
	 * Called only once.
	 * @param assertBreakpoints A list of addresses to put an assert breakpoint on.
	 */
	public setAssertBreakpoints(assertBreakpoints: Array<GenericBreakpoint>) {
		assert(false);	// override this
	}


	/**
	 * Enables/disables all assert breakpoints set from the sources.
	 * Promise is called when ready.
	 * @param enable true=enable, false=disable.
	 */
	public async enableAssertBreakpoints(enable: boolean): Promise<void> {
		assert(false);	// override this
	}


	/**
	 * Set all log points.
	 * Called only once.
	 * Promise is called after the last logpoint is set.
	 * @param logpoints A list of addresses to put a log breakpoint on.
	 */
	public async setLogpoints(logpoints: Array<GenericBreakpoint>): Promise<void> {
		assert(false);	// override this
	}


	/**
	 * Enables/disables all logpoints for a given group.
	 * Promise is called all logpoints are set.
	 * @param group The group to enable/disable. If undefined: all groups. E.g. "UNITTEST".
	 * @param enable true=enable, false=disable.
	 */
	public async enableLogpoints(group: string, enable: boolean): Promise<void> {
		assert(false);	// override this
	}


	/*
	 * Sets breakpoint in the Remote.
	 * Sets the breakpoint ID (bpId) in bp.
	 * @param bp The breakpoint.
	 * @returns The used breakpoint ID. 0 if no breakpoint is available anymore.
	 */
	public setBreakpoint(bp: RemoteBreakpoint): number {
		// return
		return 0;
	}


	/**
	 * Clears one breakpoint.
	 */
	protected removeBreakpoint(bp: RemoteBreakpoint) {
	}


	/**
	 * Reads a memory dump and converts it to a number array.
	 * @param address The memory start address.
	 * @param size The memory size.
	 * @param handler(data, addr) The handler that receives the data. 'addr' gets the value of 'address'.
	 */
	public async getMemoryDump(address: number, size: number): Promise<Uint8Array> {
		const data=new Uint8Array(size);
		return data;
	}


	/**
	 * Writes a memory dump.
	 * @param address The memory start address.
	 * @param dataArray The data to write.
	 */
	public async writeMemoryDump(address: number, dataArray: Uint8Array): Promise<void> {
		assert(false);	// override this
	}


	/**
	 * Writes one memory value to the emulator.
	 * The write is followed by a read and the read value is returned
	 * by tehe Promise.
	 * @param address The address to change.
	 * @param value The new (byte) value.
	 * @returns A Promise with the real value.
	 */
	public async writeMemory(address: number, value: number): Promise<number> {
		assert(false);	// override this
		return 0;
	}


	/**
	 * Reads the memory pages, i.e. the slot/banks relationship from zesarux
	 * and converts it to an arry of MemoryPages.
	 * @returns A Promise with an array with the available memory pages.
	 */
	/*
	public async getMemoryPages(): Promise<MemoryPage[]> {
		return [];
	}
	*/
}

