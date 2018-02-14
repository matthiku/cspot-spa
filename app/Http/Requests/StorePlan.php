<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePlan extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->isEditor();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            //
            'date' => 'required|date',
            'leader_id' => 'required|integer',
            'type_id' => 'required|integer',
            'changer' => 'required|max:255',
            'date_end' => 'nullable|date',
            'teacher_id' => 'integer',
            'start' => 'date',
            'info' => 'max:255',
            'subtitle' => 'max:255',
            'private' => 'boolean',
        ];
    }
}
